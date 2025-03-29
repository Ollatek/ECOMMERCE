const nodemailer = require('nodemailer');

class Email {
    constructor(options) {
        this.to = options.to;
        this.from = options.from;
        this.subject = options.subject;
        this.message = options.message;
    }

    createTransport() {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendMail(mailOptions) {
        await this.createTransport().sendMail(mailOptions);
    }

    async sendResetToken() {
        const mailOptions = {
            from: 'My ecommerce application <>',
            to: this.to,
            subject: 'Your  password reset token valid for 10 minutes.',
            text: this.message
        };

        await this.sendMail(mailOptions);
    }

    async sendCreateUser() {

        const mailOptions = {
            from: 'My ecommerce application <>',
            to: this.to,
            subject: 'An eccommerce account created for you.',
            text: this.message
        };


        await this.sendMail(mailOptions);
    }

}

module.exports = Email;
