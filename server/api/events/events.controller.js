/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

var _ = require('lodash');
var async = require('async');
var dispatcher = require('./events.dispatcher');
var apiKeyModel = require('../key/key.model');
var eventsModel = require('./events.model');

var model = require('../../database');

exports.total = function(req, res) {
    if(!req.user){
        res.status(400).json({error:"missing authentication"});
        return;
    }
    var userId = req.user._id;

    async.series([function(cb){
        eventsModel.getEventCountForUser(userId, null, function(err, count){
            console.log('got count:', count);
            cb(err, count ? count : 0);
        });
    }, function(cb){
        if(req.query.afterDate){
            eventsModel.getEventCountForUser(userId, JSON.parse(req.query.afterDate), function(err, count){
                console.log('got totalAfterDate:', count);
                cb(err, count ? count : 0);
            });
        } else {
            cb(null, null);
        }
    }],function(err, results){
        if(err){
            res.status(500).json({error:"db connection failed"});
        } else {
            res.status(200).json({
                totalEvents:results[0],
                totalEventsAfterDate:results[1]
            });
        }
    });
};

exports.eventsByType = function(req, res) {
    if(!req.user){
        res.status(400).json({error:"missing authentication"});
        return;
    }
    var userId = req.user._id;
    var afterDate = req.query.afterDate ? JSON.parse(req.query.afterDate) : null;

    eventsModel.getEventsByTypeAfterDate(userId, afterDate, function(err, events){
        res.json(events);
    });
};

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

exports.eventsByActor = function(req, res) {
    var actorId = req.query.actorId;
    var before = req.query.before;
    var after = req.query.after;

    var limit = req.query.limit || 30;
    var skip = req.query.offset || 0;

    eventsModel.getEventsForActorInDateRange(
        req.user._id, actorId, after, before, limit, skip,
        handleEventsResults(res)
    );
}

exports.eventsByActorCaliperDate = function(req, res) {
    var actorId = req.query.actorId;
    var before = req.query.before;
    var after = req.query.after;

    var limit = req.query.limit || 30;
    var skip = req.query.offset || 0;

    eventsModel.getEventsForActorInCaliperDateRange(
        req.user._id, actorId, after, before, limit, skip,
        handleEventsResults(res)
    );
}

function handleEventsResults(res){
  return function(err, results){
    if(err) {
        res.status(500).json({
            success: false,
            err: err
        });
    } else {
      var events = results.toArray().map(function(e){
          return e.caliperObject;
      });
      res.status(200).json({
          success:true,
          events: events
      });
    }
  }
}

exports.countEventsByActor = function(req, res) {
    var actorId = req.query.actorId;
    var before = req.query.before;
    var after = req.query.after;

    eventsModel.getEventsCountForActorInDateRange(
        req.user._id, actorId, after, before,
        function(err, result){
          if(err) {
              res.status(500).json({
                  success: false,
                  err: err
              });
          } else {
            var count = result[0] ? result[0].value : 0;
            res.status(200).json({
                success:true,
                count: count
            });
          }
        }
    );
}

exports.pgtest = function(req, res) {

  model.getRelDatabase().then(pool => {
    pool.query('SELECT NOW()', (err, result) => {
      res.status(200).json({
        err: err,
        result:result
      });
    });
  }).catch(err => {
    console.log('ok, we got an error gettin the rel db...');
    res.status(500).json({
      err: err
    });
  });

}
