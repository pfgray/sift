var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var users = require('../api/user/user.model.js');

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
