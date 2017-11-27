const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Q = require('q');

const model = require('../database');
const userModel = require('../api/user/user.model.js');
const {hash, verify} = require('./hasher.js');
const {client} = require('../database/keystore/keystore.js') ;


module.exports.isLoggedIn = function(req, res, next){
  if(!req.user) {
    res.status(401).json({status:'error', message: 'You are not logged in'});
  } else {
    next();
  }
}

module.exports.hasRole = function(roles){
  return function(req, res, next){
    if(!req.user) {
      res.status(401).json({status:'error', message: 'You are not logged in'});
    } else if(!roles.includes(req.user.role)) {
      res.status(403).json({status:'error', message: "You're not allowed to do that"});
    } else {
      next();
    }
  }
}

module.exports.init = function(app, config){

    app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      store: new RedisStore({
        client,
        logErrors: true,
        ttl: 1200 // 20 mins
      })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    var url = config.protocol + '://' + config.domain + ':' + config.port;

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
      },
      function(username, password, done) {
        console.log('okay, verifying user:', username, password);
        userModel.getUser(username)
          .then(user => {
            if(user === null){
              done(false)
            } else {
              verify(password, user.password).then(verified => {
                if(!verified){
                  done(null, false);
                } else {
                  done(null, user);
                }
              });
            }
          })
          .catch(err => done(err));
      }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user.username);
    });
    passport.deserializeUser(function(username, done) {
      userModel.getUser(username).then(user => {
        done(null, user);
      }).catch(err => done(null, {}));
    });
};
