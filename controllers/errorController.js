const AppError = require("../utils/appError");

const handleJsonWebTokenError = ()=> new AppError('Invalid token, please login', 401);
const handleTokenExpiredError = ()=> new AppError('Your token has expired, please login again.', 401);
const handleCastToObjectIdDB = ()=> new AppError('Invalid resource id', 400);

const sendErrorDevelopment = (err, res) => {

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack
    });
};

module.exports = (err, req, res, next)=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = {...err};
    error.message = err.message;

    if(error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if(error.name === 'TokenExpiredError') error = handleTokenExpiredError();
    if(error.statusCode === 500) error = handleCastToObjectIdDB();

    sendErrorDevelopment(error, res);
};

/*


// if(process.env.NODE_EVN === 'development') sendErrorDevelopment(err);
    // else if(process.env.NODE_EVN === 'production') {

    //     sendErrorProduction(err)
    // } 




const sendErrorProduction = err => {

    if(err.isOperational) {
        res.status(statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        res.status(statusCode).json({
            status: 'Er',
            message: 'Something went very wrong.'
        });
    }
};

*/ 