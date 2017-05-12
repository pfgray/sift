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
    events_by_type: {
      map: function(doc){
        if(doc.type === 'caliperEvent'){
          emit([doc.scoped_caliper_user_id, doc.recieved, doc.caliperObject['@type']], doc);
        }
      },
      reduce: function (key, values, rereduce) {  if (rereduce) {    return sum(values);  } else {    return values.length;  }}
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
