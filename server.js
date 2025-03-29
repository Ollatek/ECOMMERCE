const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/config.env` });

const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);

const DB = process.env.DB_URL.replace('<password>', process.env.DB_PASSWORD);

mongoose.connect(DB).then(() => {
    console.log('DB successfully connected.');
    app.listen(PORT, () => {
        console.log(`Server listening at port ${PORT}`);
    });
}).catch(err => console.log('ERROR...', err));


