// import { SMTPClient } from 'emailjs';
// var ejs = require('emailjs');

import("emailjs").then(emailjs => {

  var client = new emailjs.SMTPClient({
    user: 'strawberry.kiwimoment@gmail.com',
    password: 'StrawberryKiwi1234',
    host: 'smtp.gmail.com',
    ssl: true,
  });

  client.send(
    {
      text: 'i hope this works',
      from: 'strawberry.kiwimoment@gmail.com',
      to: 'sritejapashya@gmail.com',
      // cc: 'else <else@your-email.com>',
      subject: 'testing emailjs',
    },
    (err, message) => {
      console.log(err || message);
    }
  );
});
