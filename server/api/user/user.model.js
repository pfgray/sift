'use strict';

var _ = require('lodash');
var model = require('../../database');
var keyGenerator = require('../key/key.generator.js');

module.exports = {
    getUser:function(username, callback){
        var db = model.getDatabase();
        db.view('caliper-store/users', {key:username}, function (err, res) {
            //TODO: is there a better way to find a single entity?
            callback(err, _.transform(res, function(result, entity){
                return result.push(entity.value);
            })[0]);
        });
    },
    findOrCreate:function(identifier, user, callback){
        var db = model.getDatabase();
        db.view('caliper/users', {key:identifier}, function (err, res) {
            //TODO: is there a better way to find a single entity?
            console.log('got res: ', res);
            if(res.length < 1){
                var db = model.getDatabase();
                identifier.type = "user";
                keyGenerator.generateApiKey(function(err, apiKey){
                    identifier.apiKey = apiKey;
                    var newUser = _.merge(user, identifier);
                    console.log('creating user... ', JSON.stringify(newUser));
                    db.save(newUser, function (err, res) {
                        callback(err, _.merge(newUser, {
                          _id:res.id
                        }));
                    });
                });

            } else {
                callback(err, _.transform(res, function(result, entity){
                    return result.push(entity.value);
                })[0]);
            }
        });
    }
}
