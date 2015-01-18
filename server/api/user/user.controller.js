'use strict';

var _ = require('lodash');
var model = require('./user.model');

// Get list of things
exports.login = function(req, res) {
    model.getUser(req.body.username, function(err, user){
        if(err){
            console.log('error getting user: ', req.body.username, err);
            res.json({
                status:'error',
                message:err
            }, 500);
        } else {
            delete user.password;
            delete user._rev;
            res.json(user);
        }
    });
};
