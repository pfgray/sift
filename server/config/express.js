/**
 * Express configuration
 */
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
var cors = require('cors');
var httpProxy = require('http-proxy');

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
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(methodOverride());
  app.use(cookieParser());

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    console.log('STARTING WDS PROXY')
    var proxy = httpProxy.createProxyServer();
    app.all('/assets/*', function (req, res) {
      proxy.web(req, res, {
        target: 'http://localhost:9001'
      });
    });

    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.disable('etag');
    app.use(errorHandler()); // Error handler - has to be last
  }

  //Setup passport:
  passport_config.init(app, cfg);

};
