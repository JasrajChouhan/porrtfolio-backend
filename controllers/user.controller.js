import User from "../model/user.model.js";
import { catcheAsync } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwt.js";
import nodemailer from "nodemailer";
import dotenv from 'dotenv'
import transporter from "../mail/mail.config.js";
dotenv.config();
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';


export const signUp = catcheAsync(async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        // **** check if user already exists in db

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return next(new ErrorHandler("Email is already in use", 500));
        }

        //**** */ create new user and save it to the database
        const createdUser = await User.create({ name, email, phone, password });
        sendToken(createdUser, res, 200, "user succesfully created")

        res.status(201).json({
            status: 'success',
            message: "user created succesfully!",
            data: createdUser
        });
    } catch (error) {
        console.log('signup error', error);
        return next(new ErrorHandler(
            'Something went wrong while creating a user!', 400
        ));
    }


})

export const signIn = catcheAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email exists in the database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 404));
    }

    // Compare entered password with the one saved in the database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }



    // Generate JWT token for the user
    sendToken(user, res, 200, "user succesfully logged in")


    res.status(200).json({
        status: 'success',
        message: "User signed in successfully!",
        token,
    });
});

export const logOut = catcheAsync((req, res, next) => {
    res.status(201)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now())
        })
        .json({
            success: true,
            message: "User successfully logged out !"
        })
})


export const getUser = catcheAsync(async (req, res, next) => {

    try {

        const user = req.user;
        console.log(user);

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        return next(new ErrorHandler(
            'some error occoured during get user', 400
        ))

    }



})

export const updateEmail = catcheAsync(async (req, res, next) => {
    const { id } = req.params;
    const email = req.body;

    try {
        let user = await User.findById(id);
        if (!user) {
            return next(new ErrorHandler("Oops! not find the user", 400))
        }

        user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
        console.log(user);
        res.status(201).json({
            success: true,
            message: "successfully update the email"
            , user
        })
    } catch (error) {
        next(new ErrorHandler(
            'email not update succefully', 400
        ))

    }

})

export const updateName = catcheAsync(async (req, res, next) => {
    const { id } = req.params;
    const name = req.body;

    try {
        let user = await User.findById(id);
        if (!user) {
            return next(new ErrorHandler("Oops! not find the user", 400))
        }
        user = await User.findByIdAndUpdate(id, name, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })
        console.log(user);
        res.status(201).json({
            success: true,
            message: "successfully update the name"
            , user
        })
    } catch (error) {
        next(new ErrorHandler(
            'name not update succefully', 400
        ))

    }

})


// forgetPassword, resetPassword

export const forgetPassword = catcheAsync(async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorHandler('Email not found', 404));
        }

        // Generate JWT token for the user
        sendToken(user, res, 200, 'Successfully generated JWT for forget password');

        console.log(process.env.EMAIL);
        const { token } = req.cookies;
        let link = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`
        console.log(link);

        // Send the reset password email to the user
        let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Reset Password',
            html: `<div style="font-family: 'Arial', sans-serif; background-color: #f3f4f6; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333;">Reset Your Password</h1>
                <p style="font-size: 16px; margin-bottom: 20px; color: #666;">Click on the following link to reset your password:</p>
                <a href="${link}" style="display: inline-block; background-color: #3182ce; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; margin-bottom: 20px;">Reset Password</a>
                <p style="font-size: 14px; margin-bottom: 20px; color: #999;">The link will expire in 10 minutes.</p>
                <p style="font-size: 14px; margin-bottom: 20px; color: #999;">If you didn't request a password reset, please ignore this email.</p>
            </div>
        </div>`,
        })

        console.log('Email sent:', info);
        res.status(200).json({
            success: true,
            message: `Email sent successfully to ${user.name}`,
            info
        });
    } catch (error) {
        console.error('Error in forgetPassword:', error);
        return next(new ErrorHandler('Something went wrong', 500));
    }
});





export const resetPassword = async (req, res) => {
    try {
        // Verify the token sent by the user
        const decodedToken = jwt.verify(
            req.params.token,
            process.env.JWT_SECRET_KEY
        );

        // If the token is invalid, return an error
        if (!decodedToken) {
            return res.status(401).send({ message: "Invalid token" });
        }

        // find the user with the id from the token
        const user = await User.findOne({ _id: decodedToken.id });
        if (!user) {
            return res.status(401).send({ message: "no user found" });
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        req.body.password = await bcryptjs.hash(req.body.password, salt);

        // Update user's password, clear reset token and expiration time
        user.password = req.body.password;
        await user.save();

        // Send success response
        res.status(200).send({ message: "Password updated" });
    } catch (err) {
        // Send error response if any error occurs
        res.status(500).send({ message: err.message });
    }
}