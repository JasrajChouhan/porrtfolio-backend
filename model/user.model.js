import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "name must contain at least 3 character"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "please provide a valid email"],
    },
    phone: {
        type: String,
        required: [true, "insert a valid phone number"],
        minlength: [10, "phone number must be of minimum length 10"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required field"],
        minlength: [6, "minimum of length of password is 6"],
        select : false
    },
    
}, {timestamps: true});


// hashing the password  before saving it to database
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
});


// compaire the password  with hashed one in database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcryptjs.compare(enteredPassword, this.password);
};


// generate the jwt token for auth
userSchema.methods.getJWTTOKEN = function () {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


const  User = mongoose.model("User", userSchema);

export default User;