var session = require('express-session');
var passport = require('passport');

var userModel = require('../api/user/user.model.js');

module.exports.login = function(req, res, next){
    userModel.findOrCreate({
        custom_id: "anonymous"
    }, {
        displayName:"Anonymous"
    }, function(err, user) {
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/dashboard');
        });
    });
};
