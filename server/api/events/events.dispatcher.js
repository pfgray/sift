'use strict';

var _ = require('lodash');

// Get list of things
module.exports.dispatcher = function(io) {
    io.on('connection', function(socket){
        console.log('a user connected');
        var eventCount = 0;
        setInterval(function(){
            socket.emit('event', {
                message:"event #:" + ++eventCount
            });
        }, 1000);
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
};
