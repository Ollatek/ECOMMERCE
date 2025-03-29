const catchAsync = require('../utils/catchAsync');
const Order = require('./../models/orderModel');
const Cart = require('./../models/cartModel');
const Product = require('./../models/productModel');

exports.createOrder = catchAsync(async (req, res, next) => {

    let cart = await Cart.findOne({ user: req.user.id });



    const items =  cart.items.map(async item => {
        const product = await Product.findById(item.product);

        if(product) {
            return {
                product: item.product,
                quantity: item.quantity,
                price: product.price
            }
        }

        return {

        };
    });

    const order = await Order.create({
        user: req.user.id,
        shipping_address: req.body.shipping_address,
        items,
        
    });

    cart.items = [];
    await cart.save({validateBeforeSave: false});

    res.status(200).json({
        status: 'success',
        message: 'Order created successfully.'
    });
});
