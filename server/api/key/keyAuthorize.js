
var apiKeyModel = require('./key.model');

module.exports = function(req, res, next) {
    var apiKey = req.header('Authorization');
    if(!apiKey){
        res.status(400).json({
            success: false,
            error: "An api key is required for submitting events"
        });
        return;
    } else {
        req.apiKey = apiKey.trim();

        apiKeyModel.getUserForApiKey(apiKey, function(err, user){
            if(user && req.params.userid === user._id){
                req.user = user;
                next();
            } else if(user){
                res.status(403).json({
                    success:false,
                    error:"Key: " + apiKey + " does not belong to user"
                });
            } else {
                res.status(403).json({
                    success:false,
                    error:"No user found for key: " + apiKey
                });
            }
        });
    }

}
