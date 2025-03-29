const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.productImages = upload.fields([
    { name: 'images', maxCount: 5 }
]);

exports.resizeProductPhoto = catchAsync(async (req, res, next) => {

    if (!req.files.images) return next();

    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = `product-${req.params.productId}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/products/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});


/*

if (!req.file) return next();
  
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  
    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/users/${req.file.filename}`);

*/



