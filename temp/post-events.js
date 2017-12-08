const request = require('request-promise');
const argv = require('yargs').argv

function eventByType(type) {
  switch(type) {
    case 'viewed':
      return require('./viewed-item.json');
    case 'saved':
      return require('./saved-item.json');
    default:
      throw new Error('ay m8y, there be no treasure heerrr')
  }
}

var event = eventByType(argv.type);
event.eventTime = new Date().toISOString();
event.object.extensions.attemptId = argv.attemptId;

console.log(event);

request({
  method: 'POST',
  uri: 'http://localhost:6506/api/buckets/1/events',
  body: {
    data: event
  },
  json: true,
  headers: {
    'Authorization': 'wnadEudhpRtc9kDKPO1MapxMC96XQ0'
  }
})
  .then(() => console.log('done'))
  .catch(err => console.log(err));
