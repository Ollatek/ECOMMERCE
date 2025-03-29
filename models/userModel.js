const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        require: [true, 'Please provide your first name.']
    },
    email: {
        type: String,
        unique: [true, 'Email already exist. Please provide a new one.'],
        require: [true, 'Please provide your email.'],
        validate: [validator.isEmail, 'Please enter a valid email addess.']
    },
    password: {
        type: String,
        require: [true, 'Please provide your password.'],
        minlength: [8, 'Password length must be greater or equal to 8.'],
        select: false
    },
    confirm_password: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    },
    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'An order must have at least one product'],
            ref: 'Product'
        }
    ],
    photo: String,
    password_reset_token: String,
    password_reset_expires_in: Date,
    password_change_at: Date
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.pre('save', function (next) {

    if (this.isModified('password') && !this.isNew) {
        this.password_change_at = Date.now() - 1000;
    }
    next();
});

userSchema.methods.comparePasswords = async function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.checkPasswordChangedAt = function (JWTTimestamp) {
    if (this.password_change_at) {
        const passwordLastChanged = parseInt(new Date(this.password_change_at).getTime() / 1000, 10);
        return JWTTimestamp > passwordLastChanged;
    }
    return true;
};

userSchema.methods.createResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.password_reset_expires_in = Date.now() + 600000;
    return resetToken;
};


const User = mongoose.model('User', userSchema);

module.exports = User;