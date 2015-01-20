/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var async = require('async');
var dispatcher = require('./events.dispatcher');
var apiKeyModel = require('../key/key.model');
var eventsModel = require('./events.model');

// Get list of things
exports.total = function(req, res) {
    if(!req.user){
      res.status(400).json({error:"missing authentication"});
      return
    };
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

exports.add = function(req, res) {
    //req.header --> check apiKey here
    console.log('streaming: ', req.body);

    var apiKey = req.header('Authorization');
    if(!apiKey){
        res.status(400).json({
            success: false,
            error: "An api key is required for submitting events"
        });
        return;
    } else {
        apiKey = apiKey.trim();
    }

    apiKeyModel.getUserForApiKey(apiKey, function(err, user){
        if(user && req.params.userid === user._id){
            var processEvent = function(event){
                //TODO: add some sort of validation... where is the spec???
                dispatcher.stream(user._id, req.body);
                res.status(200).json({
                    success:true
                });
            }
            //if the request body is an array, process all of the events
            if(_.isArray(req.body)){
                _.each(req.body, function(event){
                    processEvent(event);
                });
            } else {
                processEvent(req.body);
            }
        } else if(user){
            res.status(403).json({
                success:false,
                error:"Key: " + apiKey + " does not belong to user"
            });
        } else {
            res.status(400).json({
                success:false,
                error:"No user found for key: " + apiKey
            });
        }
    });

}
