var session = require('express-session');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var userModel = require('../api/user/user.model.js');

module.exports.init = function(app, config){
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    var url = config.protocol + '://' + config.domain + ':' + config.port;
    passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: url + "/auth/google/callback"
        }, function(accessToken, refreshToken, profile, done) {
            console.log('got: ', accessToken, refreshToken, profile);
            var googleUser = profile._json;
            googleUser.googleId = profile.id;
            googleUser.displayName = profile.displayName;
            googleUser.googleAccessToken = accessToken;
            googleUser.googleRefreshToken = refreshToken;
            userModel.findOrCreate({
                googleId: profile.id
            }, googleUser, function(err, user) {
                return done(err, user);
            });
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
};
