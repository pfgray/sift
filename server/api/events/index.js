'use strict';

var express = require('express');
var controller = require('./events.controller');

var router = express.Router();

router.get('/', controller.index);

module.exports.router = router;
module.exports.dispatcher = require('./events.dispatcher').dispatcher;
