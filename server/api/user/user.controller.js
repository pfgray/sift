'use strict';

var _ = require('lodash');
var model = require('./user.model');

// Get list of things
exports.login = function(req, res) {
  console.log('okay, hit login: ', req.user);
  res.json({}, 200);
};

exports.signup = function(req, res) {
  model.createUser({
    username: req.body.username,
    password: req.body.password
  })
  .then(userAndBucket => {
    res.json(userAndBucket, 200);
  })
  .catch(err => {
    res.json(err, 400);
  });
}

exports.currentUser = function(req, res){
  if(!req.user){
    res.status(403).json({
      error:"not authenticated"
    });
  } else {
    res.status(200).json(req.user);
  }
}
