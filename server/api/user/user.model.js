'use strict';

var _ = require('lodash');
var model = require('../../database');
var keyGenerator = require('../key/key.generator.js');
var knex = require('knex')({client: 'pg'});

module.exports = {
    getUser:function(username){
      return model.getRelDatabase()
        .then(pool => {
          const query = knex.select('id', 'username')
            .where('username', username)
            .from('users').toString();
          return pool.query(query)
            .then(resp => resp[0]);
        });
    },
    createUser: function(user){
      return model.getRelDatabase().then(pool => {
        const insert = knex('users').insert(user).toString();
        return Q.all([pool, pool.query(insert)]);
      }).then(([pool, user]) => {
        console.log('okay, created user: ', user);
        // const defaultBucket = {
        //   name: 'Default',
        //   apiKey: keyGenerator.generateApiKey()
        // };
        // const insert = knex('users').insert(user).toString();

        // todo: create bucket
      })
    }
}
