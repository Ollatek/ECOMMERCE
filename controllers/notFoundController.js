const AppError = require('../utils/appError');
module.exports = (req, res, next)=> {
    next(new AppError('This route is not defined', 404));
};