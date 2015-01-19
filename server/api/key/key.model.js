'use strict';

var _ = require('lodash');
var model = require('../../database');

module.exports = {
    getUserForApiKey:function(apiKey, callback){
        var db = model.getDatabase();
        db.view('caliper/apiKeys',{key:apiKey}, function (err, res) {
            callback(err, _.transform(res, function(result, entity){
                return result.push(entity.value);
            })[0]);
        });
    }
};
