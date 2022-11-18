var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');

var app = express();
const server = http.createServer(app);
const port = 3000;
server.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server listening on port ${port}`);
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(limiter);

app.get("/", (err, req, res,) => {
  res.sendFile('index.html');
  if (err) {
    console.log(err);
    res.sendFile('error.html');
  }
});
