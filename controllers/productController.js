const fs = require('fs/promises');
const Product = require('./../models/productModel');
const Cart = require('./../models/cartModel');
const WishList = require('./../models/wishListModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const deleteFile = async (images, next) => {
    try {
        await Promise.all(images.map(async image => {
            await fs.unlink(`${__dirname}/../public/img/products/${image}`)
        }));
    } catch (err) {
        return next(new AppError('There was an error unlinking images, please try again', 500));
    }
};

exports.createProduct = catchAsync(async (req, res, next) => {

    const {
        name, description,
        image, category,
        short_description, price,
        tags } = req.body;

    const product = await Product.create({
        name,
        short_description,
        description,
        image,
        price,
        category,
        tags
    });

    res.status(201).json({
        status: 'success',
        data: {
            data: product
        }
    });
});

exports.getProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find();

    if(req.isLoggedIn) {
        const cart = await Cart.findOne({user: req.userId});
        const wishList = await WishList.findOne({user: req.userId});
        products.forEach(product => {
            cart.items.forEach(item => {
                if(item.product == product.id) {
                    product.in_user_cart = true;
                    product.quantity_in_cart = item.quantity;
                }
            });
            wishList.items.forEach(item => {
                if(item == product.id) {
                    product.in_user_wishlist = true;
                }
            });
        });
    }

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            data: products
        }
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.productId);

    if (!product) {
        return next(new AppError('There is no product with this id', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: product
        }
    });
});

exports.deleteProducts = catchAsync(async (req, res, next) => {
    await Product.deleteMany();
    res.status(204).json({});
});

exports.deleteProduct = catchAsync(async (req, res, next) => {

    const product = await Product.findById(req.params.productId);
    if(!product) {
        return next(new AppError('There is no product with this id', 404));
    }
    await deleteFile(product.images, next);

    await product.delete();

    res.status(204).json({});
});

exports.updateProduct = catchAsync(async (req, res, next) => {

    const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!product) {
        await deleteFile(req.body.images, next);
        return next(new AppError('There is no products with this id', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            data: product
        }
    });
});


