const Category = require('./../models/categoryModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const notFoundMessage = 'There is no category with this id';

exports.createCategory = catchAsync(async (req, res, next) => {

    const { name, description, image, sub_categories } = req.body;
    const category = await Category.create({
        name,
        description,
        image,
        sub_categories
    });

    res.status(200).json({
        status: 'success',
        data: {
            data: category
        }
    });
});

exports.getCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find();

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: {
            data: categories
        }
    });
});

exports.getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
        return next(new AppError(notFoundMessage, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: category
        }
    });
});

exports.deleteCategories = catchAsync(async (req, res, next) => {
    await Category.deleteMany();
    res.status(204).json({});
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.categoryId);
    if (!category) {
        return next(new AppError(notFoundMessage, 404));
    }
    res.status(204).json({});
});

exports.updateCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndUpdate(req.body, { new: true });

    if (!category) {
        return next(new AppError(notFoundMessage, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: category
        }
    });

});

