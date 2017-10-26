// Starting point for entire application

// Dependencies
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan'); // loggin framework
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB setup
mongoose.connect('mongodb://localhost:serverside-authentication/auth');

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*'}));
router(app);

// Server Setup
const port = process.env.PORT || 4040;
const server = http.createServer(app);
server.listen(port);
console.log('server listening on: ', port);

