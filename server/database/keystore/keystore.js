const redis = require('redis');
const Q = require('q');

const service = require('../Service.js');
// var config = require('../../config');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});


client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = service({
  prefix: 'REDIS',
  get: function(){
    return Q.when(client);
  },
  init: function(){
    client.set("string key", "string val", redis.print);
    // no initialization necessary
    return Q.when(client);
  }
});

module.exports.client = client;
