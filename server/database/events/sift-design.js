module.exports = {
  _id:"_design/caliper",
  language:"javascript",
  views:{
    events:{
      map: function(doc){
        if(doc.type === 'caliperEvent'){
          emit(doc._id, doc);
        }
      }
    },
    users: {
      map: function(doc){
        if(doc.type === 'user'){
          if(doc.username){
            emit({username:doc.username}, doc);
          }
          if(doc.googleId){
            emit({googleId:doc.googleId}, doc);
          }
        }
      }
    },
    apiKeys: {
      map: function(doc){
        if(doc.type === 'user'){
          if(doc.apiKey){
            emit(doc.apiKey, doc);
          }
        }
      }
    },
    events_by_user: {
      map: function(doc){
        if(doc.type === 'caliperEvent'){
          emit([doc.scoped_caliper_user_id, doc.recieved], doc);
        }
      },
      reduce: function (key, values, rereduce) {
        if (rereduce) {
          return sum(values);
        } else {
          return values.length;
        }
      }
    },
    events_by_actor: {
      map: function (doc){
        if(doc.type === 'caliperEvent'){
          emit([doc.scoped_caliper_user_id, doc.caliperObject.actor.id, doc.recieved], doc);
        }
      },
      reduce: function (key, values, rereduce) {
        if (rereduce) {
          return sum(values);
        } else {
          return values.length;
        }
      }
    },
    events_by_actor_caliper_date: {
      map: function (doc){
        if(doc.type === 'caliperEvent'){
          emit([doc.scoped_caliper_user_id, doc.caliperObject.actor.id, doc.caliperObject.eventTime], doc);
        }
      }
    },
    events_by_type: {
      map: function(doc){
        if(doc.type === 'caliperEvent'){
          emit([doc.scoped_caliper_user_id, doc.recieved, doc.caliperObject['@type']], doc);
        }
      },
      reduce: function (key, values, rereduce) {  if (rereduce) {    return sum(values);  } else {    return values.length;  }}
    },
    count_assessment_item_starts: {
      map: function(doc) {
        if (doc && doc.action == 'http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed' &&
          doc.object && doc.object.type == 'http://purl.imsglobal.org/caliper/v1/lis/AssessmentItem')
        emit(doc.bucket);
      },
      reduce: function (key, values, rereduce) {
        if (rereduce) {
          return sum(values);
        } else {
          return values.length;
        }
      }
    },
    average_item_time: {
      map: function(doc) {
        if (doc && doc.action == 'http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed' &&
          doc.object && doc.object.type == 'http://purl.imsglobal.org/caliper/v1/lis/AssessmentItem') {
            emit([doc.bucket, doc.object.id, doc.object.extensions.attemptId, 'started'], {started: true, time: doc.eventTime})
        } else if(doc && doc.action == 'Saved' &&
          doc.object && doc.object.type == 'http://purl.imsglobal.org/caliper/v1/lis/AssessmentItem') {
            emit([doc.bucket, doc.object.id, doc.object.extensions.attemptId, 'finished'], {started: false, time: doc.eventTime})
        }
      },
      reduce: function (key, values, rereduce) {
        if (rereduce) {
          return sum(values) / values.length;
        } else {
          var start = values.find(function(item) {
            return item.action == 'http://purl.imsglobal.org/vocab/caliper/v1/action#Viewed'
          });
          var end = values.find(function(item) {
            return item.action == 'http://purl.imsglobal.org/vocab/caliper/v1/action#Saved'
          });
          return Math.floor(Date(end.eventTime).getTime() / 1000) - Math.floor(Date(start.eventTime).getTime() / 1000);
        }
      }
    }
  },
  lists:{
    group_by_type: function(head, req){
      provides('json', function(){
        var EVENT_TYPE_INDEX = 2;
        var results = {};
        while (row = getRow()) {
          var count = 0;
          var eventType = row.key[EVENT_TYPE_INDEX];
          if(typeof results[eventType] === 'undefined'){
              results[eventType] = 0;
          }
          results[eventType] += 1;
        }

        return JSON.stringify(results);
      });
    }
  }
}
