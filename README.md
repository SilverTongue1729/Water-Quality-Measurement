# Water-Quality-Measurement

Water Quality Measurement Project for EC3.202 Embedded Systems Workshop Monsoon '22

- Simple website created, updates latest values directly from Thingspeak
- Added Graphs and Permissible limits
- Styled the website
- Added Button to Download csv data between given two dates
- Added form for email
- Made Server for sending html
- Server can receive emails and store emails
- Server maintains log of unsafe entries
- Nodemailer is finally working

Details

- ESP32 was used
- Created using Express and Node
- Nodemailer was used to send emails
- Project mail is strawberry.kiwimoment@gmail.com
- [Thingspeak Channel](https://thingspeak.com/channels/1904915)
- [Website](https://water-quality-measurement-production.up.railway.app/) hosted on railway.app
- email subscription doesn't work for global website, but works on localhost
- [OM2M Server](https://esw-onem2m.iiit.ac.in/webpage/welcome/index.html?context=/~&cseId=in-cse), If it is still online, login is esw_guest:esw_guest
- Run `npm start` and view [localhost](http://127.0.0.1:5000/)
