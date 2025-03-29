const WishList = require('./../models/wishListModel');
const catchAsync = require('./../utils/catchAsync');


exports.updateWishList = catchAsync(async (req, res, next) => {

    let wishList = await WishList.findOne({ user: req.user.id });

    if (wishList.items.indexOf(req.body.product) === -1) {
        wishList.items.push(req.body.product);
        wishList = await wishList.save({ validateBeforeSave: false });
    }

    res.status(200).json({
        status: 'success',
        message: 'WishList updated successfully'
    });
});


exports.getWishList = catchAsync(async (req, res, next) => {
    const wishList = await WishList.findOne({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        data: {
            data: wishList
        }
    });
});

exports.deleteWishList = catchAsync(async (req, res, next)=> {
    await WishList.findOneAndUpdate({ user: req.user.id }, { items: [] }, { new: true });
    res.status(204).json({});
});

