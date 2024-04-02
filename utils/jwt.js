export const sendToken = (user, res, statusCode, message) => {
    const token = user.getJWTTOKEN();

    const options = {
        expires: new Date(
            Date.now() + Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true 
    };

    res.status(statusCode).cookie('token', token, options).json({
        status: 'success',
        message: message,
        token: token,
        user
    });
};
