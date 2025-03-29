const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');


exports.createReview = catchAsync(async (req, res, next) => {
    const review = await Review.create({
        user: req.user.id,
        message: req.body.message,
        product: req.body.product,
        rating: req.body.rating
    });

    res.status(201).json({
        status: 'success',
        message: 'Review sent successfully.',
        data: {
            data: review
        }
    });
});

exports.getProductReviews = catchAsync(async (req, res, next) => {
    const reviews = await Review.find({ product: req.body.product });

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            data: reviews
        }
    });
});

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: review
        }
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    await Review.findOneAndDelete({ id: req.params.reviewId, user: req.user.id });
    res.status(204).json({});
});

exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findOneAndUpdate({
        id: req.params.reviewId,
        user: req.user.id
    }, { message: req.body.message, rating: req.body.rating }, { new: true });

    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: review
        }
    });
});
