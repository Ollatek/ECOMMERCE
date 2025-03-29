const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const notFoundController = require('./controllers/notFoundController');
const routes = require('./routes');
const app = express();
app.use(express.json());

routes(app);

app.all('*', notFoundController);
app.use(globalErrorHandler);

module.exports = app;
