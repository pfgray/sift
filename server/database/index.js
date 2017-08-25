var pg = require('./postgres');
var couch = require('./couchdb');

// todo: should these be named by what they store, instead of what they are?
module.exports = {
  getRelDatabase: pg.get,
  getEventStore: couch.get
};
