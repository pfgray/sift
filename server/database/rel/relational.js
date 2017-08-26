var Q = require('q');
const { Pool, Client } = require('pg');
var fs = require('fs');
var path = require('path');
const Sequelize = require('sequelize');

var service = require('../Service.js');
var relations = require('./relations.js');

const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD, {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

var models;

module.exports = service({
  prefix: 'COUCH',
  get: function(){
    return Q.when(models);
  },
  init: function(){
    return sequelize
      .authenticate()
      .then(() => {
        console.log('connected successfully to rel database ', process.env.PGDATABASE);

        models = relations(sequelize);
        //init all of them in order
        console.log('initializing models...', models);
        return Object.keys(models).reduce((proms, key) => {
          console.log('initializing model...', key, 'with', proms);
          return proms.then(() => models[key].sync())
        }, Q.when(true)).then(() => models);
      })
      .then(() => models);
  }
});
