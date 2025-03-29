const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'An order must have a user'],
        ref: 'User'
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Please provide product']
            },
            price: Number,
            quantity: Number 
        }
    ],
    total_amount: Number,
    shipping_address: {
        type: String,
        required: [true, 'Please provide shipping address.']
    },
    payment_method: {
        type: String
    },
    is_delivered: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

