var Q = require('q');
const { Pool, Client } = require('pg');
var fs = require('fs');
var path = require('path');
const Sequelize = require('sequelize');
const config = require('../../config/environment');
const userCreator = require('../../api/user/userCreator.js');

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
  prefix: 'POSTGRES',
  get: function(){
    return Q.when(models);
  },
  init: function(){
    return sequelize
      .authenticate()
      .then(() => {
        models = relations(sequelize);
        //init all of them in order
        console.log('initializing models...', models);
        return Object.keys(models).reduce((proms, key) => {
          console.log('initializing model...', key, 'with', proms);
          return proms.then(() => models[key].sync())
        }, Q.when(true)).then(() => models);
      })
      .then(() => {
        // initialize admins?
        if(config.admin.username && config.admin.pw){
          return userCreator({
            username: config.admin.username,
            password: config.admin.pw,
            role: 'admin'
          })(models);
        } else {
          return Q.when(true);
        }
      })
      .then(() => models);
  }
});

