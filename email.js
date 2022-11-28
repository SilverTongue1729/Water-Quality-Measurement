const nodemailer = require('nodemailer');
const fs = require("fs");


var send_Email = function () {
  return new Promise((resolve, reject) => {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'strawberry.kiwimoment@gmail.com',
        pass: 'zpcnsrgukdhlsuoq'
      }
    });

    var email_list = [];

    fs.readFile('emails.json', (err, data) => {
      var json = JSON.parse(data);
      json.emails.forEach(email => email_list.push(email.email))
    });
    console.log(email_list);

    const mail_options = {
      from: 'strawberry.kiwimoment@gmail.com',
      to: email_list,
      subject: 'Water Quality Alert',
      text: "The water near deployed node is not fit for consumption. Please avoid consuming it until the quality improves. You will be notified when it is fit for consumption once again.\n\nSincerely,\nStrawberry Kiwi Moment Water Quality team"
    }
    transporter.sendMail(mail_options, (err, info) => {
      if (err) {
        console.log(err);
        return reject({ message: 'Failed to send email' });
      }
      console.log("emails sent successfully");
      return resolve({ message: 'Emails sent successfully' });
    });
  });
}

module.exports = {send_Email};

