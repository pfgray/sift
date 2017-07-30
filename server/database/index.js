'use strict';

var EventEmitter = require('events');
var path = require('path');
var jf = require('jsonfile');
var util = require('util');
var cradle = require('cradle');
var Q = require('q');
const { Pool, Client } = require('pg');
var couch_design = require('../config/caliper-design.js');
var couch = require('../config/environment').couch;
var fs = require('fs');

var dbEmitter = new EventEmitter();

// todo: this would be useful to abstract! use symbols for event id?
var esInitted = false;
var esInitting = false;
const ES_INITTED = 'ES_INITTED';

const pg_pool = new Pool();
var relInitted = false;
var relInitting = false;
const REL_INITTED = 'REL_INITTED';

module.exports = {
  initES: function(){
    esInitting = true;
    console.log('initing event store...', couch);
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
        dbEmitter.emit(ES_INITTED, err);
        esInitting = false;
      } else if (exists) {
        esInitted = true;
        esInitting = false;
        console.log('database: ' + couch.db_name + ' already exists');
        updateDesign(couch_design);
        dbEmitter.emit(ES_INITTED, null, c);
      } else {
        console.log('database does not exists.');
        db.create(function(err){
          // do something if there's an error
          if(!err){
            // populate design documents
            updateDesign(couch_design);
            console.log('database ' + couch.db_name + ' created successfully');
            esInitted = true;
            esInitting = false;
            dbEmitter.emit(ES_INITTED, null, c);
          } else {
            esInitting = false;
            console.log('Error creating database: ' + couch.db_name + '...', err);
            dbEmitter.emit(ES_INITTED, err);
          }
        });
      }
    });
  },
  _getEventStore:function(cb){
    if(esInitting){
      console.log('were currently initting the es, so just wait for the event');
      // wait for the init
      dbEmitter.on(ES_INITTED, function(err, c){
        cb(err, c ? c.database(couch.db_name):null);
      });
    } else if(!esInitted) {
      // init
      console.log('es not initted yet, so initting...');
      this.initES();
      //wait for the init
      dbEmitter.on(ES_INITTED, function(err, c){
        console.log('es is initted!', err, c);
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
  getEventStore: function(){
    console.log('getting the db...');
    return Q.ninvoke(this, '_getEventStore');
  },

  /**
   * Inits the Relational database.
   */
  initRel: function(){
    esInitting = true;
    console.log('initing relational store...');
    return Q.nfapply(fs.readFile, [path.join(__dirname, 'initRel.sql'), 'utf-8']).then(sql => {
      console.log('executing sql with: ', sql);
      return pg_pool.query(sql);
    }).then(res => {
      esInitted = true;
      esInitting = false;
      console.log('initted: ', res);
      dbEmitter.emit(ES_INITTED, null, pg_pool);
      return pg_pool;
    }).catch(err => {
      esInitting = false;
      console.log('error initting: ', err);
      dbEmitter.emit(ES_INITTED, err);
      throw err;
    });
  },
  _getRelDatabase: function() {
    const handleRes = def => (err, pg_pool) => {
      if(err) {
        console.log('got error initting rel db:');
        deferred.reject(err);
      } else {
        console.log('finished initting rel db:');
        deferred.resolve(pg_pool);
      }
    }
    if(relInitting){
      console.log('were currently initting the es, so just wait for the event');
      this.initRel();
      const deferred = Q.defer();
      dbEmitter.on(REL_INITTED, handleRes(deferred));
      return deferred;
    } else if(!relInitting) {
      console.log("ok, let's start and wait for the event");
      const deferred = Q.defer();
      dbEmitter.on(REL_INITTED, handleRes(deferred));
      return deferred;
    } else {
      return Q.when(pg_pool);
    }
  },
  getRelDatabase: function(){
    console.log('getting the rel db...');
    return Q.ninvoke(this, '_getRelDatabase');
  }
}
