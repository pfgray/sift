var _ = require('lodash');
var Q = require('q');
var model = require('../../database');

exports.countAssessmentItemsStarted = function(req, res) {
    const bucketId = req.bucket.id;
    model.getEventStore()
        .then(store => {
            return Q.ninvoke(store, 'view', 'caliper/count_assessment_item_starts', {
                key: bucketId,
                reduce: true,
                group: true
            }).then(result => {
                console.log('got count back: ', result);
                return result;
            })
        })
        .then(result => {
            return res.json(result).status(200);
        })
        .catch(err => res.json(err).status(500))
}

exports.calculateAssessmentItemTime = function(req, res) {
    const bucketId = req.bucket.id;
    const itemId = req.params.itemId;
    model.getEventStore()
        .then(store => {
            const startkey = [bucketId, itemId];
            const endkey = [bucketId, itemId, {}];

            return Q.ninvoke(store, 'view', 'caliper/average_item_time', {
                startkey: startkey,
                endkey: endkey,
                group_level: 2,
                group: true,
                reduce: true
                // key: bucketId,
                // reduce: true,
                // group: true
            }).then(result => {
                console.log('got count back: ', result);
                return result;
            })
        })
        .then(result => {
            return res.json(result).status(200);
        })
        .catch(err => res.json(err).status(500))
}