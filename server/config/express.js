/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport_config = require('./passport.js');
var cors = cors = require('cors');

module.exports = function(app) {
  var env = app.get('env');

  app.use(cors());

  var cfg = {
    protocol: process.env.HOST_PROTOCOL || 'http',
    domain: process.env.HOST_DOMAIN || 'localhost',
    port: process.env.HOST_PORT || 9000
  };

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    //app.use(require('connect-livereload')());
    var tempStaticRoot = path.join(config.root, '.tmp');
    var clientStaticRoot = path.join(config.root, 'client');
    console.log('public assets: ', tempStaticRoot, clientStaticRoot);
    app.use(express.static(tempStaticRoot));
    app.use(express.static(clientStaticRoot));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.disable('etag');
    app.use(errorHandler()); // Error handler - has to be last
  }

  //Setup passport:
  passport_config.init(app, cfg);

};
