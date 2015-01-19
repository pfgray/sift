'use strict';

var _ = require('lodash');
var model = require('../../database');

module.exports = {
    storeEvent:function(userid, event, callback){
        event.scoped_caliper_user_id = userid;
        var db = model.getDatabase();
        db.save(event, function (err, res) {
            callback(err, res);
        });
    }
}
