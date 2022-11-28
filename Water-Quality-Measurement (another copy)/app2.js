var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');
var log_values = require('./logger.js');

var email = "";

var app = express();
const port = process.env.PORT || 5000;
// const server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(limiter);

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server listening on port ${port}`);
});

log_values.log_vals();
console.log("logger started");

app.get("/", (err, req, res,) => {
  res.sendFile('index.html');
  if (err) {
    console.log(err);
    res.sendFile('error.html');
  }
});

// app post request
app.post('/add', (req, res) => {
  console.log(req.body.name, req.body.email);
  email = req.body.email;
  res.redirect('http://127.0.0.1:5000/');
});