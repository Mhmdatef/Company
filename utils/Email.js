const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        const transporter = nodeMailer.createTransport({
    secure: false, // جرب true لو هتستخدم 465
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const mailOptions = {
            from: 'Movie Reservation System <hello@3atef.com>',
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ', info.response);
    } catch (error) {
        console.error('Error sending email: ', error); // ده أهم سطر 
        throw error; // رجع الخطأ زي ما هو عشان يظهر في الكونسول
    }
};

module.exports = sendEmail;
