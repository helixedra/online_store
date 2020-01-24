const path = require('path')
const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars')
require('dotenv').config()

// Nodemailer config
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Handlebars template engine for nodemailer
const options = {
    viewEngine: {
        extName: '.handlebars',
        partialsDir: path.join(__dirname, '../views/'),
        layoutsDir: path.join(__dirname, '../views/'),
        defaultLayout: '',
    },
    viewPath: path.join(__dirname, '../views/'),
    extName: '.handlebars',
};

//attach the plugin to the nodemailer transporter
transporter.use('compile', hbs(options));

module.exports = transporter