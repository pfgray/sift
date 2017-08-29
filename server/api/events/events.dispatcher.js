const _ = require('lodash');
const Q = require('q');
const model = require('../../database');
const crypto = require('crypto');

const eventCache = {};
const eventCacheLimit = 30;

const cacheEvent = function(bucketId, event){
    if(!eventCache[bucketId]){
        eventCache[bucketId] = [];
    }
    eventCache[bucketId].push(event);
    if(eventCache[bucketId].length > eventCacheLimit){
        eventCache[bucketId].shift();
    }
}

const eventStream = {
    //listeners will hold a map, where the key is
    //a user's id, and the value is an array of
    //listeners listening to that user's event stream.
    listeners:{},
    pushEvent:function(bucketId, event){
        // todo: is this cache even necessary now that we have redis?
        cacheEvent(bucketId, event);
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

const md5 = str => crypto.createHash('md5').update(str).digest("hex");
module.exports.md5 = md5;
const keyOf = arr => arr.map(i => i.toString()).join(".");
module.exports.keyOf = keyOf;

const EVENT_TTL = '60';

module.exports.stream = function(bucketId, event){
    //todo: implement model.storeEvent for redis...
    const now = (new Date()).getTime();
    const actorId = md5(event.actor.id);
    model.getKeystore().then(client => {

        const eventKey = keyOf(['event', bucketId, actorId, now]);
        console.log('Storing event in redis...', eventKey);

        // todo: use client.multi() to batch these?

        const batched = client.multi()
          .lpush(eventKey, JSON.stringify(event))
          .zadd([keyOf(['eventTimes', bucketId, actorId]), now, eventKey])
          .zadd([keyOf(['eventTimes', bucketId]), now, eventKey])
          .expire(eventKey, EVENT_TTL)
          .expire(keyOf(['eventTimes', bucketId, actorId]), EVENT_TTL)
          .expire(keyOf(['eventTimes', bucketId]), EVENT_TTL)

        return Q.ninvoke(batched, 'exec');
        // return Q.all([
        //     Q.ninvoke(client, 'lpush', eventKey, JSON.stringify(event)),
        //     Q.ninvoke(client, 'zadd', [keyOf(['eventTimes', bucketId, actorId]), now, eventKey]),
        //     Q.ninvoke(client, 'zadd', [keyOf(['eventTimes', bucketId]), now, eventKey]),
        //     Q.ninvoke(client, 'expire', eventKey, EVENT_TTL),
        //     Q.ninvoke(client, 'expire', keyOf(['eventTimes', bucketId, actorId]), EVENT_TTL),
        //     Q.ninvoke(client, 'expire', keyOf(['eventTimes', bucketId]), EVENT_TTL)
        // ]);
    })
    .then(() => {
        console.log('Streaming to browser....');
        eventStream.pushEvent(bucketId, event);
    }).catch(err => console.error(err));
};
