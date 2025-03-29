const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A cart must belong to a user.']
    },
    items: [
        {
            quantity: Number,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: [true, 'Please provide product']
            }
        }
    ],
    status: {
        type: String,
        enum: {
            values: ['opened', 'closed', 'abandoned'],
            message: 'Not a valid value'
        },
        default: 'opened'
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
    }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
