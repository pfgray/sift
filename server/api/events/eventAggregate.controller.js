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