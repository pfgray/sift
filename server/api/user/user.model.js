const _ = require('lodash');
const model = require('../../database/index.js');
const keyGenerator = require('../key/key.generator.js');
const Q = require('q');
const {hash} = require('../../config/hasher.js');
const create = require('./userCreator.js');

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

const resolveEntity = result => result === null ? null : result.get({plain: true});

module.exports = {
    getUser: function(username){
      console.log('hrm...', model);
      return model.getRelDatabase()
        .then(models => {
          return models.User.findOne({ where: { username } })
            .then(resolveEntity);
        });
    },
    getUserById:function(id){
      return model.getRelDatabase()
        .then(models => {
          return models.User.findOne({ where: {id} })
            .then(resolveEntity);
        });
    },
    createBucketForUser: function(id, name){
      return Q.all([
        model.getRelDatabase(),
        this.getUserById(id)
      ]).then(([models, user]) => {
        const inBucket = {
          userId: user.id,
          apiKey: keyGenerator.generateApiKey(),
          name
        };
        return models.Bucket.create(inBucket)
          .then(resolveEntity);
      });
    },
    deleteBucket: function(bucketId) {
      return model.getRelDatabase()
      .then(models => {
        return models.Bucket.destroy({
          where: {
            id: bucketId
          }
        });
      })
    },
    getBuckets: function(userId) {
      return model.getRelDatabase()
        .then(models => models.Bucket.findAll({ where: { userId } }))
        //.then(result => result.get({plain: true}));
    },
    getBucket: function(id) {
      return model.getRelDatabase()
        .then(models => models.Bucket.findOne({ where: { id } }));
    },
    create: create,
    UserAlreadyExistsError,
    UnkownError
}
