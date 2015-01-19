'use strict';

var _ = require('lodash');
var model = require('./key.model.js');

var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var keyLength = 30;

module.exports = {
    generateApiKey:function(callback){
        var apiKey = "";
        for(var i=0; i<keyLength; i++){
            apiKey += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        model.getUserForApiKey(apiKey, function(err, user){
            if(err){
                callback(err);
            } else if(user != null){
                this.generateApiKey(user);
                this.generateApiKey(callback);
            } else {
                callback(null, apiKey);
            }
        }.bind(this));
    }
}
