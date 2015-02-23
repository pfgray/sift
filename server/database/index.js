'use strict';

var jf = require('jsonfile');
var util = require('util');
var cradle = require('cradle');
var couch = require('../config/environment').couch;
var couch_design = require('../config/caliper-design.js')

module.exports = {
  init: function(config){
    console.log('initing database...', couch);
    var c =  new(cradle.Connection)(couch.host, couch.port, {
        cache: true,
        raw: false,
        forceSave: true
    });
    var db = c.database(config.couch.db_name);
    var updateDesign = function(design){
        db.save(design._id, design);
    }
    db.exists(function (err, exists) {
      if (err) {
        console.log('could not determine if database: ' + config.couch.db_name + ' exists, ', err);
      } else if (exists) {
        console.log('database: ' + config.couch.db_name + ' already exists');
        updateDesign(couch_design);
      } else {
        console.log('database does not exists.');
        db.create(function(err){
          // do something if there's an error
          if(!err){
            updateDesign(couch_design);
            console.log('database' + config.couch.db_name + ' created successfully');
            // populate design documents
          } else {
            console.log('Error creating database: ' + config.couch.db_name + '...', err);
          }
        });
      }
    });
  },
  getDatabase:function(){
    var c =  new(cradle.Connection)(couch.host, couch.port, {
        cache: true,
        raw: false,
        forceSave: true
    });
    return c.database(couch.db_name);
  }
}
