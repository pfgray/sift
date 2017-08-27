
var apiKeyModel = require('./key.model');
const model = require('../../database');

module.exports = function (req, res, next) {
    const apiKey = req.header('Authorization');
    if (!apiKey) {
        res.status(400).json({
            success: false,
            error: "An api key is required for submitting events"
        });
    } else {
        req.apiKey = apiKey.trim();
        model.getRelDatabase().then(models => {
            return models.Bucket.findOne({ where: { id: req.params.bucketId } })
                .then(result => result.get({plain: true}));
        }).then(bucket => {
            if(bucket.apiKey !== req.apiKey){
                res.status(400).json({
                    success: false,
                    error: "This key is not for this bucket."
                });
            } else {
                req.bucket = bucket;
                next();
            }
        });
    }
}
