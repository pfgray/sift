'use strict';

var _ = require('lodash');
var model = require('../../database');
var apiKeyModel = require('../key/key.model.js');

var eventCache = {};
var eventCacheLimit = 30;

var cacheEvent = function(bucketId, event){
    console.log('caching event for: ', bucketId);
    console.log('eventCache contains: ', eventCache);
    if(!eventCache[bucketId]){
        eventCache[bucketId] = [];
    }
    eventCache[bucketId].push(event);
    if(eventCache[bucketId].length > eventCacheLimit){
        eventCache[bucketId].shift();
    }
}

var eventStream = {
    //listeners will hold a map, where the key is
    //a user's id, and the value is an array of
    //listeners listening to that user's event stream.
    listeners:{},
    pushEvent:function(bucketId, event){
        cacheEvent(bucketId, event);
        console.log('okay, we got event for bucket: ', bucketId, ' and we have listeners: ', this.listeners);
        if(this.listeners[bucketId]){
            _.each(this.listeners[bucketId], function(listener){
                listener(event);
            });
        }
    },
    addListener:function(bucketId, listener){
        if(!this.listeners[bucketId]){
            this.listeners[bucketId] = [];
            this.listeners[bucketId].push(listener);
        } else {
            this.listeners[bucketId].push(listener);
        }
    },
    removeListener:function(bucketId, listener){
        if(this.listeners[bucketId]){
            var index = this.listeners[bucketId].indexOf(listener);
            if (index > -1) {
                this.listeners[bucketId].splice(index, 1);
            }
        }
    }
};

// Get list of things
module.exports.dispatcher = function(io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        var disconnected = false;
        var connectedBucketId = null
        var listener = function(event){
            socket.emit('event', event);
        };

        socket.on('connectStream', function(apiKey){
            console.log('attaching to bucket stream for apiKey: ', apiKey);
            model.getRelDatabase().then(models => {
              return models.Bucket.findOne({ where: { apiKey } })
                       .then(result => result.get({plain: true}));
            }).then(bucket => {
                console.log('okay, got bucket...');
                if(!disconnected){
                    console.log('adding listener for event stream, bucket ', JSON.stringify(bucket));
                    eventStream.addListener(bucket.id, listener);
                    connectedBucketId = bucket.id;
                    const cachedEvents = eventCache[bucket.id];
                    socket.emit('initialEvents', cachedEvents || []);
                }
            }).catch(err => console.error(err));
        });
        socket.on('disconnect', function() {
            disconnected = true;
            if(connectedBucketId) {
                eventStream.removeListener(connectedBucketId, listener);
            }
        });
    });
};

module.exports.stream = function(bucketId, event){
    //todo: implement model.storeEvent for redis...
    
    console.log('Okay, now streaming event: ', event);
    //model.storeEvent(bucketId, event, function(err, storedEvent){
        eventStream.pushEvent(bucketId, event);    
    //});
};
