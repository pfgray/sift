var _ = require('lodash');
var Q = require('q');
var async = require('async');
var dispatcher = require('./events.dispatcher');

var model = require('../../database');

exports.add = function (req, res) {
  var processEvent = function (event) {
    dispatcher.stream(req.bucket.id, event);
  };
  if (_.isArray(req.body.data)) {
    req.body.data.forEach(processEvent);
  } else {
    processEvent(req.body.data);
  }
  dispatcher.cleanup();
  res.status(200).json({
    success: true
  });
}

function getRange(before, after) {
  const end = before ? new Date(before).getTime() : '+inf';
  const begin = after ? new Date(after).getTime() : '-inf';
  return [begin, end];
}

exports.eventsByActor = createEventRequestHandler('eventTimes', 'eventTimesByActor');

exports.eventsByActorCaliperDate = createEventRequestHandler('eventTimesCaliper', 'eventTimesCaliperByActor');

function createEventRequestHandler(rangeKey, rangeKeyForActor) {
  return function (req, res) {
    const [begin, end] = getRange(req.query.before, req.query.after);

    const key = req.query.actorId ? (
      dispatcher.keyOf([rangeKeyForActor, req.bucket.id, dispatcher.md5(req.query.actorId)])
    ) : (
      dispatcher.keyOf([rangeKey, req.bucket.id])
    );


    console.log('Okay, now querying: ', key, 'with: ', begin, ' to: ', end);

    model.getKeystore().then(client => {
      return Q.all([client, Q.ninvoke(client, 'zrangebyscore', [dispatcher.keyOf([key]), begin, end])]);
    })
    .then(([client, results]) => {
      console.log('Okay, got results ', results);
      const batched = results.reduce((builder, key) => {
        return builder.lrange([key, 0, -1]);
      }, client.multi());

      return Q.ninvoke(batched, 'exec');
    })
    .then(events => {
      // events is an array of arrays, let's flatten them
      const flattened = [].concat.apply([], events);
      res.json({
        success: true,
        events: flattened.map(JSON.parse)
      }).status(200);
    })
    .catch(err => {
      console.error(err);
      res.json(err).status(500)
    });
  }
}

exports.redis = function (req, res) {

  model.getKeystore().then(client => {
    return Q.ninvoke(client, 'keys', '*');
  }).then(hmm => {
    console.log('Getting keys...');
    res.json(hmm);
  });
}
