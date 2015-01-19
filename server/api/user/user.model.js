'use strict';

var _ = require('lodash');
var model = require('../../database');

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
    findOrCreate:function(user, callback){
        var db = model.getDatabase();
        db.view('caliper/users', {key:user}, function (err, res) {
            //TODO: is there a better way to find a single entity?
            console.log('got res: ', res);
            if(res.length < 1){
                var db = model.getDatabase();
                user.type = "user";
                console.log('creating user... ', JSON.stringify(user));
                db.save(user, function (err, res) {
                    callback(err, {
                      _id:res.id
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
