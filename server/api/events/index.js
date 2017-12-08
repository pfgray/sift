var express = require('express');
var controller = require('./events.controller');
var aggregateController = require('./eventAggregate.controller');
var authorizeKey = require('../key/keyAuthorize.js');

var router = express.Router();

router.post('/buckets/:bucketId/events', authorizeKey, controller.add);
router.get( '/buckets/:bucketId/events', authorizeKey, controller.eventsByActor);
router.get( '/buckets/:bucketId/eventsByCaliperDate', authorizeKey, controller.eventsByActorCaliperDate);
router.get( '/buckets/:bucketId/events/aggregates', authorizeKey, aggregateController.countAssessmentItemsStarted );

module.exports.router = router;
module.exports.dispatcher = require('./events.dispatcher').dispatcher;
