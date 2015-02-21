
var $ = require('jquery');

var EventService = {
    eventSocket:null,
    getCurrentUserAndEventCount: function(pastDate, successCallback, errorCallback){
        $.when($.ajax("/api/me"), $.ajax("/api/me/eventCount?afterDate=" + JSON.stringify(pastDate)))
        .done(function(user, eventCount){
            user = user[0];
            eventCount = eventCount[0];
            user.eventsUrl = window.location.origin + '/api/users/' + user._id + '/events';
            successCallback(user, eventCount);
        })
        .fail(function(error){
            errorCallback(error);
        });
    },
    getEventStreamForUser: function(user){
        if(!this.eventSocket){
          this.eventSocket = io();
          this.eventSocket.emit('connectStream', user.apiKey);
        }
        return this.eventSocket;
    },
    getEventCountMap: function(pastDate, successCallback, errorCallback){
        $.ajax("/api/me/eventsByType?afterDate=" + JSON.stringify(pastDate))
        .done(successCallback)
        .fail(errorCallback);
    }
};

module.exports = EventService;
