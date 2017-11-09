const bcrypt = require('bcrypt');
const Q = require('q');

const config = require('./environment');

const saltRounds = 10;

module.exports = {
  hash: function(plaintext) {
    return Q.ninvoke(bcrypt, 'hash', plaintext, saltRounds).then(result => {
      console.log("computed hash: ", typeof result);
      return result;
    });
  },
  verify: function(plaintext, hash) {
    return Q.ninvoke(bcrypt, 'compare', plaintext, hash);
  }
}
