'use strict';

var express = require('express');
var controller = require('./events.controller');
var authorizeKey = require('../key/keyAuthorize.js');

var router = express.Router();

router.post('/users/:userid/events', authorizeKey, controller.add);
router.get('/users/:userid/events', authorizeKey, controller.eventsByActor);
router.get('/users/:userid/eventsCount', authorizeKey, controller.countEventsByActor);
router.get('/me/eventCount', controller.total);
router.get('/me/eventsByType', controller.eventsByType);

module.exports.router = router;
module.exports.dispatcher = require('./events.dispatcher').dispatcher;
