const _ = require('lodash');
const Q = require('q');
const model = require('../../database');
const crypto = require('crypto');

const eventCache = {};
const eventCacheLimit = 30;

const md5 = str => crypto.createHash('md5').update(str).digest("hex");
module.exports.md5 = md5;
const keyOf = arr => arr.map(i => i.toString()).join(".");
module.exports.keyOf = keyOf;

const EVENT_TTL = '350'; // 5 minutes, in seconds

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

module.exports.stream = function(bucketId, event){

    //todo: can we simply batch all of the streams?
    const now = (new Date()).getTime();
    const caliperTime = new Date(event.eventTime).getTime();
    // console.log('okay, now storing:', event.actor)
    const actorId = md5(event.actor['@id']);
    model.getKeystore().then(client => {

        const eventKey = keyOf(['event', bucketId, actorId, now]);
        const eventCaliperKey = keyOf(['eventCaliper', bucketId, actorId, caliperTime]);
        console.log('Storing event in redis...', eventKey, 'for caliper time: ', caliperTime);

        // todo: use client.multi() to batch these?

        // todo: remove indexing by caliper date
        const batched = client.multi()
          .lpush(eventKey, JSON.stringify(event))
          .lpush(eventCaliperKey, JSON.stringify(event))
          .zadd([keyOf(['eventTimes', bucketId, actorId]), now, eventKey])
          .zadd([keyOf(['eventTimesCaliper', bucketId, actorId]), caliperTime, eventCaliperKey])
          .expire(eventKey, EVENT_TTL)
          .expire(eventCaliperKey, EVENT_TTL)
          .expire(keyOf(['eventTimes', bucketId, actorId]), EVENT_TTL * 2)
          .expire(keyOf(['eventTimesCaliper', bucketId, actorId]), EVENT_TTL * 2)

        return Q.ninvoke(batched, 'exec');
    })
    .then(() => {
        console.log('Storing event in couchdb', event['@id']);


        function extract(event) {
            return {
                bucket: bucketId,
                actorId: event['actor']['@id'],
                action: event['action'],
                eventTime: event['eventTime'],
                object: {
                    id: event['object']['@id'],
                    type: event['object']['@type'],
                    extensions: event['object']['extensions']
                }
            }
        }

        return model.getEventStore()
            .then(couchdb => {
                return Q.ninvoke(couchdb, 'save', event['@id'], extract(event));
            })
    })
    .then(() => {
        console.log('Streaming to browser....');
        eventStream.pushEvent(bucketId, event);
    }).catch(err => console.error(err));
};

module.exports.cleanup = function() {
    // removes keys in scored ranges that don't exist anymore.
    model.getKeystore().then(client => {
        const now = new Date();
        now.setSeconds(now.getSeconds() - 5 - EVENT_TTL);
        const timeAgo = now.getTime();
        Q.ninvoke(client, 'keys', "eventTimes*").then(keys => {
            console.log('Found: ', keys, 'to cleanup from before', timeAgo);
            const batched = keys.reduce((multi, key) => multi.zremrangebyscore([key, '-inf', timeAgo]), client.multi());
            return Q.ninvoke(batched, 'exec');
        }).then(result => {
            console.log('removed', result, 'entries');
        }).catch(console.error);
    }).catch(console.error);
};
