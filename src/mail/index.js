require("dotenv").config();
const nodemailer = require("nodemailer");
const {
  verifyAccountTemplate,
  forgotPasswordTemplate,
} = require("./templates.mail");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const verifyAccountMail = async (email, token) => {
  const info = await transporter.sendMail({
    from: `AUTH <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify Account",
    html: verifyAccountTemplate(token),
  });
  return info;
};

const forgotPasswordMail = async (email, token) => {
  const info = await transporter.sendMail({
    from: `AUTH <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Reset Password",
    html: forgotPasswordTemplate(token),
  });
  return info;
};

module.exports = { verifyAccountMail, forgotPasswordMail };
