const axios = require('axios');
// const fs = require("fs");

var send_emails = async function () {
  axios({
    type: 'POST',
    url: 'https://api.emailjs.com/api/v1.0/email/send',
    data: JSON.stringify({
      service_id: 'service_7e3mpvp',
      template_id: 'template_notsafe',
      user_id: 'yA8iLWs9wHIzVwD4e',
      template_params: {
        'name': 'Sriteja Pashya',
        'email': 'sritejapashya@gmail.com',
        'message': 'The pH is above the saftey limit.'
      }
    }),
    contentType: 'application/json'
  }).then(res => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log('Successfully sent emails');
  }).catch(error => {
    console.log(error.statusCode);
    console.log("Failed to send emails");
  });
}

send_emails();