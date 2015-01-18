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

// Get list of things
exports.index = function(req, res) {
    res.json({
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
    console.log('sending out: ', req.body);
    dispatcher.stream(req.body);
    res.status(200).json({
        success:true
    });
}
