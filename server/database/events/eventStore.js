var Q = require('q');

var couch_design = require('./sift-design.js');
var couch = require('../../config/environment').couch;
var service = require('../Service.js');
var cradle = require('cradle');

module.exports = service({
  prefix: 'COUCH',
  get: function(){
    var c =  new(cradle.Connection)(couch.host, couch.port, {
      cache: true,
      raw: false,
      forceSave: true
    });
    return Q.when(c.database(couch.db_name));
  },
  init: function(){
    var c =  new(cradle.Connection)(couch.host, couch.port, {
        cache: true,
        raw: false,
        forceSave: true
    });
    var db = c.database(couch.db_name);
    var updateDesign = function(design){
      db.save(design._id, design);
    }
    return Q.ninvoke(db, 'exists').then(exists => {
      if(exists){
        console.log('database: ' + couch.db_name + ' already exists, so updating');
        updateDesign(couch_design);
        return Q.when();
      } else {
        return Q.ninvoke(db, 'create').then(() => {
          console.log('database ' + couch.db_name + ' created successfully');
          updateDesign(couch_design);
        });
      }
    }).catch(err => {
      console.log('Error retrieving couch db: ', err);
      return err;
    });
  }
});
