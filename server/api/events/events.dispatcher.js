'use strict';

var _ = require('lodash');
var model = require('./events.model.js');
var apiKeyModel = require('../key/key.model.js');

var eventCache = {};
var eventCacheLimit = 30;

var cacheEvent = function(userid, event){
    if(!eventCache[userid]){
        eventCache[userid] = [];
    }
    eventCache[userid].push(event);
    if(eventCache[userid].length > eventCacheLimit){
        eventCache[userid].shift();
    }
}

var eventStream = {
    //listeners will hold a map, where the key is
    //a user's id, and the value is an array of
    //listeners listening to that user's event stream.
    listeners:{},
    pushEvent:function(userid, event){
        cacheEvent(userid, event);
        if(this.listeners[userid]){
            _.each(this.listeners[userid], function(listener){
                listener(event);
            });
        }
    },
    addListener:function(userid, listener){
        if(!this.listeners[userid]){
            this.listeners[userid] = [];
            this.listeners[userid].push(listener);
        } else {
            this.listeners[userid].push(listener);
        }
    },
    removeListener:function(userid, listener){
        if(this.listeners[userid]){
            var index = this.listeners[userid].indexOf(listener);
            if (index > -1) {
                this.listeners[userid].splice(index, 1);
            }
        }
    }
};

// Get list of things
module.exports.dispatcher = function(io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        var disconnected = false;
        var connectedUserId = null
        var listener = function(event){
            socket.emit('event', event);
        };

        socket.on('connectStream', function(apiKey){
            console.log('attaching to user stream for apiKey: ', apiKey);
            apiKeyModel.getUserForApiKey(apiKey, function(err, user){
                if(!disconnected && user){
                    console.log('adding listener for event stream, user ', JSON.stringify(user));
                    eventStream.addListener(user._id, listener);
                    connectedUserId = user._id;
                    var cachedEvents = eventCache[user._id];
                    socket.emit('initialEvents', cachedEvents || []);
                }
            });
        });
        socket.on('disconnect', function(){
            disconnected = true;
            if(connectedUserId){
                eventStream.removeListener(connectedUserId, listener);
            }
        });
    });
};

module.exports.stream = function(userid, event){
    model.storeEvent(userid, event, function(err, storedEvent){
        eventStream.pushEvent(userid, storedEvent);
    });
};
