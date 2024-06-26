import nodemailer from "nodemailer";
import dotenv from 'dotenv';

import _Blog from '../../model/blog.model';

dotenv.config();

interface SendEmailProp {
    email: string;
    username: string;
    otp: string;
}

interface SendMailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }
  

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.ADDRESS_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const HTMLOrder = ({email, username, otp} : SendEmailProp) => `<html>
<head>
<style>

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
table {
  border-collapse: collapse;
  width: 100%;
}

.bold {
  font-size: 20px;
  font-weight: 700;
  margin: 10px 0;
}
.info {
  margin: 5px 0;
}

</style>
</head>
<body>
    <h2>Hi, ${username}</h2>
    <div>Thank you for our account</div>
    <div>Please, confirm OTP code on the app, it'll expired in one minute</div>
    <div style="text-algin: center;">
        <span style="border: 1px solid #000; border-radius: 6px; padding: 2px 6px;">${otp}</span>
    </div>
  <div>
    <div>Thanks, We are very happy when to service you!</div>
  </div>
</body>
</html>`;

const sendMailer = async ({email, username, otp}: SendEmailProp) => {
    try {
      const options: SendMailOptions = {
        from: '"Tìm Gì Thế - Blogs" <foo@example.com>',
        to: email,
        subject: "Confirm email",
        text: "Hi!" + username,
        html: HTMLOrder({email, username, otp}),
      };
      await transporter.sendMail(options);
    } catch (err) {
      console.error(err);
    }
  };
  

export default sendMailer;