var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

var userModel = require('../api/user/user.model.js');

module.exports.init = function(app, config){
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    var url = config.scheme + '://' + config.domain + ':' + config.port;
    passport.use(new GoogleStrategy({
            returnURL: url + '/auth/google/return',
            realm: url + '/'
        }, function(identifier, profile, done) {
            userModel.findOrCreate({ openid: identifier }, profile , function(err, user) {
                done(err, user);
            });
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}

/*
module.exports.init = function(config){
    passport.use(new LocalStrategy(
        function(username, password, done) {
            users.getUser(username, function(err, user){
                if (err) { return done(err); }
                else {
                    if(password !== user.password){
                        console.log('password was wrong, rejecting');
                        return done(null, false, {message: 'incorrect password!'});
                    }
                }
                console.log('password was correct');
                return done(null, user);
            });
        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
        users.getUser(username, function(err, user){
            done(err, user);
        });
    });
}
*/
