const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A wishlist must belong to a user.']
    },
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Please provide product']
        }
    ]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
});

const WishList = mongoose.model('WishList', wishListSchema);

module.exports = WishList;
