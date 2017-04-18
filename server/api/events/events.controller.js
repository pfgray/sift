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
    //req.header --> check apiKey here

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
                dispatcher.stream(user._id, event);
            };
            if(_.isArray(req.body.data)){
                req.body.data.forEach(processEvent);
            } else {
                processEvent(req.body.data);
            }
            res.status(200).json({
                success:true
            });
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
