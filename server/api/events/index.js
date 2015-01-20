'use strict';

var express = require('express');
var controller = require('./events.controller');

var router = express.Router();

router.post('/users/:userid/events', controller.add);
router.get('/me/eventCount', controller.total);

module.exports.router = router;
module.exports.dispatcher = require('./events.dispatcher').dispatcher;
