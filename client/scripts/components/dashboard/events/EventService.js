'use strict';

var $ = require('jquery');
var EventCache = require('./EventCache.js');

var EventService = {
    eventSocket:null,
    eventCache:new EventCache(),
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
    getEventStreamForBucket: function(bucket, onInitialEvents){
        if(!this.eventSocket){
          this.eventSocket = io();
          this.eventSocket.emit('connectStream', bucket.apiKey);
          this.eventSocket.on('event', event => {
              this.eventCache.cacheEvent(event);
          });
          this.eventSocket.once('initialEvents', initialEvents => {
              console.log('got initial events:', initialEvents);
              this.eventCache.setInitialEvents(initialEvents);
              onInitialEvents && onInitialEvents(this.eventSocket, initialEvents);
          });
        } else {
          onInitialEvents && setTimeout(() => onInitialEvents(this.eventSocket, []), 0);
        }
    },
    getEventCountMap: function(pastDate, successCallback, errorCallback){
        $.ajax("/api/me/eventsByType?afterDate=" + JSON.stringify(pastDate))
            .done(successCallback)
            .fail(errorCallback);
    },
    cacheEvent: function(event){
        this.eventCache.cacheEvent(event);
    },
    getCachedEvents: function(){
        return this.eventCache.cachedEvents;
    }
};

module.exports = EventService;
