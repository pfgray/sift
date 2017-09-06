
const {hash} = require('../../config/hasher.js');
const keyGenerator = require('../key/key.generator.js');

module.exports = function create(inUser){
    return async function(models){
      try {
        const password = await hash(inUser.password);
    
        const defaults = { password };
        const [user, created] = await models.User.findOrCreate({
          where: {username: inUser.username}, defaults
        }).then(([user, created]) => [user.get({plain: true}), created]);
    
        if(!created) {
          console.log('we didnt create this user, so not creating bucket..');
          return [user, false];
        }
        const inBucket = {
          userId: user.id,
          apiKey: keyGenerator.generateApiKey(),
          name: 'Default'
        };
        const bucket = await models.Bucket.create(inBucket);
        return [user, true];
      } catch(err) {
        return Promise.reject(err);
      }
    }
  }