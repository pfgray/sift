'use strict';

var express = require('express');
var controller = require('./user.controller');
var passport = require('passport');

var router = express.Router();

router.post('/login', passport.authenticate('local'), controller.login);

module.exports = router;
