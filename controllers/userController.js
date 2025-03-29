const User = require("../models/userModel");
const Cart = require('../models/cartModel');
const WishList = require('./../models/wishListModel');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const Email = require("../utils/appEmail");

const generatePassword = size => {
    const keySpace = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*';
    let password = '';
    for (let i = 0; i < size; i++) {
        const randomNumber = Math.floor(Math.random() * keySpace.length);
        password += keySpace.charAt(randomNumber);
    }
    return password;
};

exports.getUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            data: users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return next(new AppError('No user with this id', 404));
    }

    res.status(200).json({
        status: 'success',
        results: 1,
        data: {
            data: user
        }
    });
});

exports.deleteUsers = catchAsync(async (req, res, next) => {
    await User.deleteMany({});
    res.status(204).json({});
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    await WishList.findOneAndDelete({user: req.user.id});
    await Cart.findOneAndDelete({user: req.user.id});
    await User.findByIdAndDelete(req.params.userId);
});

exports.createUser = catchAsync(async (req, res, next) => {

    const password = confirm_password = generatePassword(8);
    const { email, full_name } = req.body;

    const user = await User.create({
        full_name,
        email,
        confirm_password,
        password
    });

    const cart = await Cart.create({
        user: user.id
    });

    const wishList = await WishList.create({
        user: user.id
    });

    try {

        await new Email({
            to: user.email,
            message: `A bacola account has been created for you with login details Email- ${email} and Password- ${password}`
        }).sendCreateUser();

        res.status(200).json({
            status: 'success',
            data: {
                data: user
            }
        });

    } catch (err) {
        await Cart.findByIdAndDelete(cart.id);
        await WishList.findByIdAndDelete(wishList.id);
        await User.findByIdAndDelete(user.id);
        return next(new AppError('Error sending mail', 500));
    }
});

