const axios = require('axios');
const fs = require("fs");

var last_entry_id = 0;

var log_vals = async function () {
  axios.get('https://api.thingspeak.com/channels/1904915/feeds.json?api_key=ZDPYT298KYQGB8QD&results=1&timezone=Asia%2FKolkata')

    .then(res => {
      var fields = res.data.feeds[0];
      if (last_entry_id == fields.entry_id) {
        return;
      }
      last_entry_id = fields.entry_id;
      if (fields.field1 > 500 || fields.field2 > 30 || fields.field3 > 5 || fields.field4 < 6.5 || fields.field4 > 8.5) {
        console.log("Not safe");
        fs.readFile('log.json', (err, data) => {
          var log_json = JSON.parse(data);
          console.log(fields);
          log_json.data.push(fields);
          fs.writeFile("log.json", JSON.stringify(log_json), (err) => {
            if (err) throw err;
            console.log('data was appended to log.json');
          });
        })
      }
    })
    .catch(err => console.log(err))
  setTimeout(log_vals, 13000);
}

module.exports = { log_vals };