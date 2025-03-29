const Cart = require('./../models/cartModel');
const WishList = require('./../models/wishListModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.updateCart = catchAsync(async (req, res, next) => {

    let cart = await Cart.findOne({ user: req.user._id });
    const itemIndex = cart.items.findIndex((item, index) => {
        return item.product == req.body.product;
    });

    if (itemIndex === -1) {
        cart.items.push({
            product: req.body.product,
            quantity: req.body.quantity
        });
    }
    else {
        if (+req.body.quantity === 0) {
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items.splice(itemIndex, 1, {
                product: req.body.product,
                quantity: req.body.quantity
            });
        }
    }
    cart = await cart.save({ validateBeforeSave: false });

    const wishList = await WishList.findOne({user: req.user.id});
    const prodPosition = wishList.items.indexOf(req.body.product);
    if(prodPosition > -1) {
        wishList.items.splice(prodPosition, 1);
        await wishList.save();
    }

    res.status(200).json({
        status: 'success',
        message: 'Cart updated successfully',
        cart
    });
});

exports.deleteCart = catchAsync(async (req, res, next) => {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { new: true });
    res.status(204).json({});
});

exports.deleteCarts = catchAsync(async (req, res, next) => {
    await Cart.updateMany({}, { items: [] }, { new: true });
    res.status(204).json({});
});

exports.getCart = catchAsync(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        data: {
            data: cart
        }
    });
});

