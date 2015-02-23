'use strict';

var _ = require('lodash');
var model = require('../../database');

module.exports = {
    storeEvent:function(userid, event, callback){
        var toStore = {
            scoped_caliper_user_id: userid,
            recieved: new Date(),
            type:'caliperEvent',
            caliperObject:event
        };
        var db = model.getDatabase();
        db.save(toStore, function (err, res) {
            callback(err, toStore, res);
        });
    },
    getEventCountForUser:function(userid, afterDate, callback){
        var db = model.getDatabase();
        var startkey = afterDate ? [userid, afterDate]           : [userid];
        var endkey   = afterDate ? [userid, new Date().toJSON()] : [userid, {}];
        console.log('querying dates: ', startkey, endkey);
        db.view('caliper/events_by_user', {
            startkey: startkey,
            endkey: endkey,
            reduce: true
        }, function (err, res) {
            callback(err, _.transform(res, function(result, entity){
                return result.push(entity.value);
            })[0]);
        });
    },
    getEventsByTypeAfterDate:function(userid, afterDate, callback){
        var db = model.getDatabase();
        var startkey = afterDate ? [userid, afterDate]                     : [userid];
        var endkey   = afterDate ? [userid, new Date().toJSON(), {}]       : [userid, {}];
        console.log('querying event types: ', startkey, endkey);
        db.list('caliper/group_by_type/events_by_type', {
            startkey: startkey,
            endkey: endkey,
            reduce:true,
            group_level:3
        }, function(err, result){
            console.log('got:', err, result);
            callback(err, result);
        });
    }
}
