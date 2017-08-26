const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Q = require('q');

const userModel = require('../api/user/user.model.js');
const {hash, verify} = require('./hasher.js');

module.exports.init = function(app, config){
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
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
            // todo: verify password
            return Q.all([user, verify(password, user.password)]);
          })
          .then(([user, verified]) => {
            if(!verified){
              done(true);
            } else {
              done(null, user);
            }
          })
          .catch(err => done(err));
      }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};
