const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'An order must have a user.'],
        ref: 'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'A review must belong to a product.']
    },
    rating: {
        type: Number,
        required: [true, 'A review should have a rating.']
    },
    message: {
        type: String,
        required: [true, 'A review must have a written message.']
    }

}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
