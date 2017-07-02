'use strict';

var EventEmitter = require('events');
var jf = require('jsonfile');
var util = require('util');
var cradle = require('cradle');
var Q = require('q');
var couch_design = require('../config/caliper-design.js');
var couch = require('../config/environment').couch;

var initted = false;
var initting = false;
var dbEmitter = new EventEmitter();
const DB_INITTED = 'DB_INITTED';

module.exports = {
  init: function(){
    initting = true;
    console.log('initing database...', couch);
    var c =  new(cradle.Connection)(couch.host, couch.port, {
        cache: true,
        raw: false,
        forceSave: true
    });
    var db = c.database(couch.db_name);
    var updateDesign = function(design){
        db.save(design._id, design);
    }
    db.exists(function (err, exists) {
      if (err) {
        console.log('could not determine if database: ' + couch.db_name + ' exists, ', err);
        dbEmitter.emit(DB_INITTED, err);
        initting = false;
      } else if (exists) {
        initted = true;
        initting = false;
        console.log('database: ' + couch.db_name + ' already exists');
        updateDesign(couch_design);
        dbEmitter.emit(DB_INITTED, null, c);
      } else {
        console.log('database does not exists.');
        db.create(function(err){
          // do something if there's an error
          if(!err){
            // populate design documents
            updateDesign(couch_design);
            console.log('database ' + couch.db_name + ' created successfully');
            initted = true;
            initting = false;
            dbEmitter.emit(DB_INITTED, null, c);
          } else {
            initting = false;
            console.log('Error creating database: ' + couch.db_name + '...', err);
            dbEmitter.emit(DB_INITTED, err);
          }
        });
      }
    });
  },
  _getDatabase:function(cb){
    if(initting){
      console.log('were currently initting, so just wait for the event');
      // wait for the init
      dbEmitter.on(DB_INITTED, function(err, c){
        cb(err, c ? c.database(couch.db_name):null);
      });
    } else if(!initted) {
      // init
      console.log('not initted yet, so initting...');
      this.init();
      //wait for the init
      dbEmitter.on(DB_INITTED, function(err, c){
        console.log('initted!', err, c);
        cb(err, c ? c.database(couch.db_name):null);
      });
    } else {
      setTimeout(() => {
        var c =  new(cradle.Connection)(couch.host, couch.port, {
            cache: true,
            raw: false,
            forceSave: true
        });
        cb(null, c.database(couch.db_name));
      });
    }
  },
  getDatabase: function(){
    console.log('getting the db...');
    return Q.ninvoke(this, '_getDatabase');
  }
}
