class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 404); 
    }
    if (err.code === 11000) {
        const message = `Duplicate entry for ${Object.keys(err.keyValue).join(', ')}.`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Try again.";
        err = new ErrorHandler(message, 400);
    }
    
    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token has expired. Try again.";
        err = new ErrorHandler(message, 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

export default ErrorHandler;
