// var EventCache = require('./EventCache.js');

export default function getStreamForBucket(apiKey){
    const eventSocket = io();
    console.log('creating stream...');

    const listeners = [];
    function onEvent(listener) {
        console.log('binding listener', listener);
        if (typeof listener !== 'function') {
            throw new Error('Expected listener to be a function.')
        }
    
        let isSubscribed = true;
        listeners.push(listener);
    
        return function unsubscribe() {
            if (!isSubscribed) {
              return;
            }
            isSubscribed = false;
            const index = listeners.indexOf(listener)
            listeners.splice(index, 1)
        }
    }
    eventSocket.on('event', event => {
        console.log('got event:', event);
        listeners.forEach(l => {
            l(event);
        });
    });
    eventSocket.once('initialEvents', initialEvents => {
        console.log('got initial events:', initialEvents);
        initialEvents.forEach(event => {
            listeners.forEach(l => {
                l(event);
            });
        });
    });

    function initiate() {
        console.log('initiating bucket for: ', apiKey);
        eventSocket.emit('connectStream', apiKey);
    }

    console.log('okay, now returning');
    
    return {
        initiate,
        onEvent: onEvent
    };
};
