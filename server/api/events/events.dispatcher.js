'use strict';

var _ = require('lodash');
var model = require('./events.model.js');

var eventStream = {
    listeners:[],
    push:function(event){
        //TODO: persist to caliper db
        console.log(this.listeners);
        _.each(this.listeners, function(listener){
            listener(event);
        });
    },
    addListener:function(listener){
        this.listeners.push(listener);
        console.log('added listener, now listeners count: ', this.listeners.length);
    },
    removeListener:function(listener){
        var index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }
};

// Get list of things
module.exports.dispatcher = function(io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        var eventCount = 0;
        var listener = function(event){
            socket.emit('event', event);
        };
        eventStream.addListener(listener);
        socket.on('disconnect', function(){
            eventStream.removeListener(listener);
        });
    });
};

module.exports.stream = function(event){
    model.storeEvent(event, function(){
        eventStream.push(event);
    });
};
