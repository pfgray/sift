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
var dispatcher = require('./events.dispatcher');
var apiKeyModel = require('../key/key.model');

// Get list of things
exports.index = function(req, res) {
    res.status(200).json({
        events:[{
          message:"Event 1"
        }, {
          message:"Event 3"
        }, {
          message:"Event 2"
        }]
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
