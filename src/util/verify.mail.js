const nodemailer = require("nodemailer");

const User = require("../model/user.model");
let mailerTranporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD,
  },
});

const send = async (createUser, text) => {
  try {
    console.log(mailerTranporter);
    let mailOptions = {
      from: "backendteam@kodekrew.com",
      to: createUser.email,
      subject: "Account Verification Link",
      text: text,
    };
    console.log(mailOptions);

    const data = await mailerTranporter.sendMail(mailOptions);
    console.log("data", data);
  } catch (error) {
    console.log(error);
  }
};

module.exports = send;
