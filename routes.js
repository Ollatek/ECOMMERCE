const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
const wishListRouter = require('./routes/wishListRoutes');
const reviewRouter = require('./routes/reviewRoutes');


module.exports = app => {
    app.use('/api/v1/order', orderRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/product', productRouter);
    app.use('/api/v1/category', categoryRouter);
    app.use('/api/v1/cart', cartRouter);
    app.use('/api/v1/wish_list', wishListRouter);
    app.use('/api/v1/review', reviewRouter);
};