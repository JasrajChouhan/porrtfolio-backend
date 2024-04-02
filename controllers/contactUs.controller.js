import { catcheAsync } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/error.js';
import transporter from '../mail/mail.config.js';

export const getInfoOfRecuriter = catcheAsync(async (req, res, next) => {
    try {
        const { name, email, socailMedia } = req.body;
        const data = {
            name,
            email,
            socailMedia
        };
        const link = socailMedia;
        let info = await transporter.sendMail({
            from: email,
            to: process.env.ADMIN,
            subject: 'for job',
            html: `<div style="font-family: 'Arial', sans-serif; background-color: #f3f4f6; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333;">Regarding to client</h1>
                <p style="font-size: 16px; margin-bottom: 20px; color: #666;">Social media link</p>
                <a href="${link}" style="display: inline-block; background-color: #3182ce; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; margin-bottom: 20px;">social media link</a>
                <p style="font-size: 14px; margin-bottom: 20px; color: #999;">The link will expire in 10 minutes.</p>
                <p style="font-size: 14px; margin-bottom: 20px; color: #999;">Let's connect with me .</p>
                <div style="text-align: center;">
                    <a href="#" style="display: inline-block; background-color: #3182ce; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; margin-right: 10px;">Button 1</a>
                    <a href="#" style="display: inline-block; background-color: #3182ce; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Button 2</a>
                </div>
            </div>
        </div>`,
        });

        res.status(200).json({
            message: 'successfully filled the form and sent the mail to admin',
            success: true,
            info
        });
    } catch (error) {
        return next(new ErrorHandler('email or does not submit successfully', 400));
    }
});
