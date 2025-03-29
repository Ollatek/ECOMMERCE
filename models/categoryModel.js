const mongoose = require('mongoose');
const uniqueId = require('../utils/uniqueId');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide category name.']
    },
    description: String,
    image: String,
    sub_categories: [String],
    category_id: String
}, {timestamps: true});

categorySchema.pre('save', function (next) {
    if(this.isNew) {
        this.category_id = uniqueId();
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
