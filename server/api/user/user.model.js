var _ = require('lodash');
var model = require('../../database');
var keyGenerator = require('../key/key.generator.js');
var Q = require('q');
const {hash} = require('../../config/hasher.js');

const UserAlreadyExistsError = {
  status: 'error',
  message: 'User with this username already exists',
  code: 'user_exists'
};

const UnkownError = {
  status: 'error',
  message: 'Unknown error happened',
  code: 'unknown'
};

module.exports = {
    getUser:function(username){
      return model.getRelDatabase()
        .then(models => {
          return models.User.findOne({ where: {username: username} })
            .then(result => result.get({plain: true}));
        });
    },
    createUser: function(user){
      return create(user);
    },
    UserAlreadyExistsError,
    UnkownError
}

async function create(inUser){
  try {
    const models = await model.getRelDatabase();

    const password = await hash(inUser.password);

    const defaults = { password };
    const [user, created] = await models.User.findOrCreate({
      where: {username: inUser.username}, defaults
    }).then(([user, created]) => [user.get({plain: true}), created]);

    if(!created) {
      throw UserAlreadyExistsError;
    }
    const inBucket = {
      userId: user.id,
      apiKey: keyGenerator.generateApiKey(),
      name: 'Default'
    };
    const bucket = await models.Bucket.create(inBucket);
    return [user, bucket.get({plain: true})];
  } catch(err) {
    return Promise.reject(err);
  }
}
