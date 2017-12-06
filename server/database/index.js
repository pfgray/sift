var rel = require('./rel/relational');
var events = require('./events/eventStore');
var keystore = require('./keystore/keystore');

events.get();

module.exports = {
  getRelDatabase: rel.get,
  getEventStore: events.get,
  getKeystore: keystore.get
};
