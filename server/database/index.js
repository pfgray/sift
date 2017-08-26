var rel = require('./rel/relational');
var events = require('./events/eventStore');

// todo: should these be named by what they store, instead of what they are?
module.exports = {
  getRelDatabase: rel.get,
  getEventStore: events.get
};
