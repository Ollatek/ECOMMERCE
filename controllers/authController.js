const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('./../models/userModel');
const Cart = require('../models/cartModel');
const WishList = require('./../models/wishListModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('./../utils/appEmail');


const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const verifyToken = async (req, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in, please login to gain access.', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    return decoded;
}

exports.signUp = catchAsync(async (req, res, next) => {

    const { full_name, email, password } = req.body;

    const user = await User.create({
        full_name,
        email,
        password,
        confirm_password: password
    });

    await Cart.create({ user: user.id });
    await WishList.create({user: user.id});
    const token = createToken(user.id);

    res.status(200).json({
        status: 'Success',
        token,
        data: {
            data: user
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePasswords(password, user.password))) {
        return next(new AppError('Email or Password not correct', 400));
    }

    const token = createToken(user.id);

    res.status(200).json({
        status: 'success',
        token
    });

});

exports.protect = catchAsync(async (req, res, next) => {


    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in, please login to gain access.', 401));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    if (!user.checkPasswordChangedAt(decoded.iat)) {
        return next(new AppError('Password recently changed loggin again.', 401));
    }

    req.user = user;

    next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        let token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return next();
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next();
        }
        if (!user.checkPasswordChangedAt(decoded.iat)) {
            return next();
        }
        req.isLoggedIn = true;
        req.userId = user.id;
        return next();
    }

    req.isLoggedIn = false;
    next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new AppError('There is no user with this email.', 400));
    }

    const resetToken = user.createResetToken();
    await user.save({ validateBeforeSave: false });

    try {
        await new Email({
            to: user.email,
            message: `This is your reset token ${resetToken}`,
        }).sendResetToken();

        res.status(200).json({
            status: 'success',
            message: 'A message is sent to your email please check to reset your password.'
        });
    } catch (err) {
        user.password_reset_token = undefined;
        user.password_reset_expires_in = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Error sending mail, please try again.', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        password_reset_token: hashedToken,
        password_reset_expires_in: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid or expired token, please try again.', 400));
    }

    user.password = req.body.password;
    user.confirm_password = req.body.confirm_password;
    user.password_reset_token = undefined;
    user.password_reset_expires_in = undefined;
    await user.save();

    const token = createToken(user.id);

    res.status(200).json({
        status: 'success',
        token
    });

});
