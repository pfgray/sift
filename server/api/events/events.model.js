'use strict';

var _ = require('lodash');
var model = require('../../database');

module.exports = {
    storeEvent:function(event, callback){
        var db = model.getDatabase();
        db.save(event, function (err, res) {
            callback(err, res);
        });
    }
}
