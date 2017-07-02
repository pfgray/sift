'use strict';

var _ = require('lodash');
var model = require('../../database');

module.exports = {
    getUserForApiKey:function(apiKey, callback){
        model.getDatabase().then(function(db){
          db.view('caliper/apiKeys',{key:apiKey}, function (err, res) {
              callback(err, _.transform(res, function(result, entity){
                  return result.push(entity.value);
              })[0]);
          });
        }).catch(callback);
    }
};
