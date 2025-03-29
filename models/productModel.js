const mongoose = require('mongoose');
const uniqueId = require('../utils/uniqueId');

const productSchema = new mongoose.Schema({
    product_id: String,
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        unique: [true, 'A product name must be unique']
    },
    short_description: {
        type: String,
        required: [true, 'Please provide a short description for the product.']
    },
    description: {
        type: String
    },
    images: [String],
    price: {
        type: Number
    },
    tags: [String],
    is_available: Boolean,
    is_organic: Boolean,
    count_in_store: Number,
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: [true, 'A product must belong to a category.']
    },
    bought_times: Number,
    in_user_cart: {
        type: Boolean,
        default: false
    },
    quantity_in_cart: Number,
    in_user_wishlist: {
        type: Boolean,
        default: false
    }
});

productSchema.pre('save', function(next) {
    if(this.isNew) {
        this.product_id = uniqueId();
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

