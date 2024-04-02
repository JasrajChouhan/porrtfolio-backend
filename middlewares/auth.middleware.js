import User from "../model/user.model.js";
import jwt from 'jsonwebtoken';
import { catcheAsync } from "./catchAsyncError.js";

 const isAuthorized = catcheAsync(async (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log(token);
        if (!token) {
            return res.status(401).json({ auth: false, message: 'No token provided. || no  user logged in' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ auth: false, message: 'No user found.' });
        }

        
        req.user = user;
        next();
    } catch (error) {
        // Handle errors from JWT verification or user fetching
        return res.status(401).json({ auth: false, message: 'Unauthorized: Invalid token.' });
    }
});

export default isAuthorized;

