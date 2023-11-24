const nodemailer = require('nodemailer');
const ejs = require('ejs');

const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secureConnection: true,
    port: 465,
    transportMethod: "SMTP",
  auth: {
    user: 'pk518210@gmail.com',
    pass: 'jqjaoefwhppzmhfl'
  }
});

const sendEmail = (receiver, subject, path , content) => {
    console.log("Into the emailer");
  ejs.renderFile(__dirname + path, { receiver, content }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      var mailOptions = {
        from: 'pk518210@gmail.com',
        to: receiver,
        subject: subject,
        html: data
      };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
      });
    }
  });
};

module.exports = {
  sendEmail
};