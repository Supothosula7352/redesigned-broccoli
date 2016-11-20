var express = require('express');
var pg = require('pg');
var cors = require('cors');
var app = express();

pg.defaults.ssl = true;
db = new pg.Client(process.env.DATABASE_URL);
db.connect();
query = db.query('CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY, content TEXT)');
query.on('end', function() {
  console.log('db:ready');
});

app.use(cors());
app.use(function(req, res, next) {
  req.body = '';
  req.on('data', function(chunk) { 
    req.body += chunk;
  });
  req.on('end', function() {
    next();
  });
});

app.get('/last', function(req, res) {
  db.query('SELECT * FROM "comments" ORDER BY "id" DESC LIMIT 10', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.get('/ping', function(req, res) {
  res.send('pong');
});

app.get('/count', function(req, res) {
  db.query('SELECT COUNT(*) FROM "comments"', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.post('/', function(req, res) {
  db.query('INSERT INTO "comments" (content) VALUES($1)', [req.body], function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.send('true');
    }
  });
});

app.get('/all', function(req, res) {
  db.query('SELECT * FROM "comments" ORDER BY "id" DESC', function(err, result) {
    if (err) {
      res.send('false');
    } else {
      res.json(result.rows);
    }
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log('app:ready');
});
