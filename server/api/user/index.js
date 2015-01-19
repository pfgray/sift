'use strict';

var express = require('express');
var controller = require('./user.controller');
var passport = require('passport');

var router = express.Router();

//router.post('/login', passport.authenticate('local'), controller.login);
router.get('/me', controller.currentUser);

module.exports = router;
