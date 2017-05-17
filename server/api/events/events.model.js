'use strict';

var _ = require('lodash');
var model = require('../../database');

module.exports = {
    storeEvent:function(userid, event, callback){
        var transformedEvent = null;
        try {
          transformedEvent = transformEvent(event);
        } catch(e) {
          transformedEvent = event;
        }

        var toStore = {
          scoped_caliper_user_id: userid,
          recieved: new Date(),
          type:'caliperEvent',
          caliperObject: transformedEvent
        };

        var db = model.getDatabase();
        db.save(toStore, function (err, res) {
            callback(err, Object.assign(toStore, {
                caliperObject: event
            }), res);
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
    },
    getEventsForActorInDateRange:function(userid, actorId, startDate, endDate, limit, offset, callback){
        queryEventsByActor(false, userid, actorId, startDate, endDate, limit, offset, callback);
    },
    getEventsCountForActorInDateRange: function(userid, actorId, startDate, endDate, callback){
        queryEventsByActor(true, userid, actorId, startDate, endDate, null, 0, callback);
    },
    getEventsForActorInCaliperDateRange:function(userid, actorId, startDate, endDate, limit, offset, callback){
        queryEventsByActorWithCaliperDate(false, userid, actorId, startDate, endDate, limit, offset, callback);
    }
}

function queryEventsByActorWithCaliperDate(reduce, userid, actorId, startDate, endDate, limit, offset, callback) {
    var db = model.getDatabase();
    var startkey = startDate ? [userid, actorId, startDate]         : [userid, actorId];
    var endkey   = endDate ? [userid, actorId, endDate, {}]         : [userid, actorId, {}];

    var opts = {
        startkey: startkey,
        endkey: endkey,
        reduce: reduce,
        skip: offset
    };
    if(limit !== null) {
        opts.limit = limit;
    }
    db.view('caliper/events_by_actor_caliper', opts, function(err, result){
        console.log('got:', err, result);
        callback(err, result);
    });
}

function queryEventsByActor(reduce, userid, actorId, startDate, endDate, limit, offset, callback) {
    var db = model.getDatabase();
    var startkey = startDate ? [userid, actorId, startDate]         : [userid, actorId];
    var endkey   = endDate ? [userid, actorId, endDate, {}]         : [userid, actorId, {}];

    var opts = {
        startkey: startkey,
        endkey: endkey,
        reduce: reduce,
        skip: offset
    };
    if(limit !== null) {
        opts.limit = limit;
    }
    db.view('caliper/events_by_actor', opts, function(err, result){
        console.log('got:', err, result);
        callback(err, result);
    });
}

function after(s, c) {
  return s ? s.substring(s.lastIndexOf(c) + 1) : '';
}

function fixType(obj) {
  delete obj['@context'];

  obj.id = obj['@id'];
  delete obj['@id'];

  obj.type = after(obj['@type'], '/');
  delete obj['@type'];
}

function transformEvent(event) {
  var event = Object.assign({}, event);
  fixType(event);

  fixType(event.actor);
  fixType(event.object);
  event.group && fixType(event.group);

  event.action = after(event.action, '#');

  return event;
}
