const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "9658b5e484fcee",
    pass: "090a64d12ae4e6",
  },
});
