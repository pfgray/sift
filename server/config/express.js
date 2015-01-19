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
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var session = require('express-session');

module.exports = function(app) {
  var env = app.get('env');

  var scheme = env.scheme || 'http';
  var domain = env.domain || 'localhost';
  var port = env.port || 9000;

  app.set('views', config.root + '/server/views');
  app.set('view engine', 'jade');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
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
  app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  var url = scheme + '://' + domain + ':' + port;
  var userModel = require('../api/user/user.model.js');
  passport.use(new GoogleStrategy({
    returnURL: url + '/auth/google/return',
    realm: url + '/'
  }, function(identifier, profile, done) {
    userModel.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

};
