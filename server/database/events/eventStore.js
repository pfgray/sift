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

    // init on first time:
    [
      '_users',
      '_replicator',
      '_global_changes'
    ].map(name => () => createEmptyDb(c, name))
     .reduce(Q.when, Q(true))
     .then(() => {
       console.log('created initial databases');
     }).catch(err => {
       console.error('error creating initial databases: ', err)
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

function createEmptyDb(c, dbName) {
  var db = c.database(dbName);
  return Q.ninvoke(db, 'exists').then(exists => {
    return exists ? true : Q.ninvoke(db, 'create');
  }).then(() => true);
}
