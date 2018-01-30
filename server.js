const express = require('express');
const http = require('http');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router');

var app = express();

// DB Setup
mongoose.connect('mongodb://127.0.0.1/auth', { useMongoClient: true }, function(error) {
    if(error) { console.error('error: ', error); }
});

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type : '*/*' }));
app.use(cors());

// Append routes to the app
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
