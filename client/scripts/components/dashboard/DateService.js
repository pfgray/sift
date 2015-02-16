

var DateService = {
    getMinutesInPast:function(pastMinutes){
        return new Date((new Date()).getTime() - pastMinutes * 60000);
    }
};

module.exports = DateService;
