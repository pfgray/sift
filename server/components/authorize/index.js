module.exports = function(rights){
    return function(req, res, next) {
        var onlyAuth = false;
        if(rights === null){
            onlyAuth = true;
        } else if (typeof rights === 'string'){
            rights = [rights];
        }
        if(!req.user){
            res.json({
                error:true,
                message: 'Authentication missing'
            }, 401);
        } else{
            if(onlyAuth){
                next();
                return;
            }
            for(var i=0; i<rights.length; i++){
                if(req.user.rights.indexOf(rights[i]) > -1 ){
                    next();
                    return;
                }
            }
            res.json({
                error:true,
                message: 'I find your lack of rights disturbing'
            }, 403);
        }
    }
}
