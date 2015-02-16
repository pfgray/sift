
var $ = require('jquery');

var EventService = {
    getCurrentUserAndEventCount: function(pastDate, successCallback, errorCallback){
        $.when($.ajax("/api/me"), $.ajax("/api/me/eventCount?afterDate=" + pastDate))
        .done(function(user, eventCount){
            console.log('resolved user request...');
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
        var eventSocket = io();
        eventSocket.emit('connectStream', user.apiKey);
        return eventSocket;
    }
};

module.exports = EventService;
