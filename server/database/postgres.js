var Q = require('q');
const { Pool, Client } = require('pg');
var fs = require('fs');
var path = require('path');

var service = require('./Service.js');


const pg_pool = new Pool();

module.exports = service({
  prefix: 'COUCH',
  get: function(){
    return Q.when(pg_pool);
  },
  init: function(){
    console.log('initing relational store...');
    return Q.nfapply(fs.readFile, [path.join(__dirname, 'initRel.sql'), 'utf-8']).then(sql => {
      console.log('executing sql with: ', sql);
      return pg_pool.query(sql);
    }).then(res => {
      relInitted = true;
      relInitting = false;
      console.log('initted db: ', res);
      return pg_pool;
    }).catch(err => {
      relInitting = false;
      console.log('error initting db: ', err);
      throw err;
    });
  }
});
