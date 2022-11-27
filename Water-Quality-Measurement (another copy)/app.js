var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');  
var helmet = require('helmet');
var rateLimit = require('express-rate-limit');

var app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
// const server = http.createServer(app);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

var db = new sqlite3.Database('./database/subscribers.db');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());
app.use(limiter);
db.run('CREATE TABLE IF NOT EXISTS emp(email TEXT, name TEXT)');
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


// Insert
app.post('/add', function (req, res) {
  db.serialize(() => {
    db.run('INSERT INTO emp(email,name) VALUES(?,?)', [req.body.id, req.body.name], function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New subscriber has been added");
      //  res.send("New subscriber has been added into the database with ID = "+req.body.id+ " and Name = "+req.body.name);
    });
  });
});

//Closing connection, we need to fix, rn user needs to go to http://localhost:3000/close
app.get('/close', function (req, res) {
  db.close((err) => {
    if (err) {
      res.send('There is some error in closing the database');
      return console.error(err.message);
    }
    console.log('Closing the database connection.');
    res.send('Database connection successfully closed');
  });
});


server.listen(3000, function () {
  console.log("Server listening on port: 3000");
});
/*
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet());
app.use(limiter);

app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(`Server listening on port ${port}`);
});

app.get("/", (err, req, res,) => {
  res.sendFile('index.html');
  if (err) {
    console.log(err);
    res.sendFile('error.html');
  }
});

// app post request
app.post('/subscribe', (req, res) => {
  console.log(req.body);
  res.send('success');
} );
*/