/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log('Running caliper-store in: ' + process.env.NODE_ENV);

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
require('./config/express')(app);
require('./routes')(app, io);

//Setup db:
var db = require('./database');
db.initES();
db.initRel();

//Setup authentication scheme:
//require('./config/passport.js').init(config);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
