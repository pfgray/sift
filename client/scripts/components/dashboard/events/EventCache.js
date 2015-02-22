'use strict';

var EventCache = function(eventLimit){
    eventLimit = eventLimit || 50;

    this.cachedEvents = [];

    this.cacheEvent = function(event){
        this.cachedEvents.push(event);
        if(this.cachedEvents.length > eventLimit){
            this.cachedEvents.shift();
        }
        console.log('eventCacheNowContains: ', this.cachedEvents);
    };

    this.setInitialEvents = function(initialEvents){
        var pushEventCount = eventLimit + this.cachedEvents.length;
        initialEvents = initialEvents.slice(
          initialEvents.length - pushEventCount,
          initialEvents.length
        );
        this.cachedEvents = initialEvents.concat(this.cachedEvents);
    }

};

module.exports = EventCache;
