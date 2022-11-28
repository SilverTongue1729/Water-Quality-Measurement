async function sendMailToUser(emailId,content)
{
  return new Promise((resolve,reject)=>{    
  const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
     auth: {
          user: 'mail.zaidcoder@gcom',
          pass: 'bxmzigxhpndrqboj',
       },
  secure: true,
  });
  const mailData = {
    from: 'strawberry.kiwimoment@gmail.com',  // sender address
      to: emailId,      // list of receivers
      subject: "Water Quality Alert",   // Subject line
      text: content
    };
    transporter.sendMail(mailData, function (err, info) {
      if(err)
      {
        console.log(err);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      }
      else
      {
        console.log(info);
        resolve(true);
      }
   });
  });
}