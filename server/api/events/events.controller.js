var _ = require('lodash');
var Q = require('q');
var async = require('async');
var dispatcher = require('./events.dispatcher');

var model = require('../../database');

exports.add = function(req, res) {
    var processEvent = function(event){
        dispatcher.stream(req.bucket.id, event);
    };
    if(_.isArray(req.body.data)){
        req.body.data.forEach(processEvent);
    } else {
        processEvent(req.body.data);
    }
    res.status(200).json({
        success:true
    });
}

function getRange(before, after) {
    const end = before ? new Date(before).getTime(): '+inf';
    const begin = after ? new Date(after).getTime(): '-inf';
    return [begin, end];
}

exports.eventsByActor = createEventRequestHandler('eventTimes');

exports.eventsByActorCaliperDate = createEventRequestHandler('eventTimesCaliper');

function createEventRequestHandler(eventRangeKey) {
    return function(req, res) {
        var actorId = dispatcher.md5(req.query.actorId);

        const [begin, end] = getRange(req.query.before, req.query.after);
        const key = dispatcher.keyOf([eventRangeKey, req.bucket.id, actorId]);

        model.getKeystore().then(client => {
            return Q.all([client, Q.ninvoke(client, 'zrangebyscore', [dispatcher.keyOf([key]), begin, end])]);
        })
        .then(([client, results]) => {
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
