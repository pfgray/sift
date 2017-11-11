var _ = require('lodash');
var model = require('./user.model');

// Get list of things
exports.login = function(req, res) {
  console.log('okay, hit login: ', req.user);
  res.json({}, 200);
};

exports.signup = function(req, res) {
  model.createUser({
    username: req.body.username,
    password: req.body.password,
    role: 'user'
  })
  .then(([user, created]) => {
    if(created){
      console.log('created user: ', user);
      req.login(user, () => {
        res.json({user}, 200);
      });
    } else {
      res.status(400).json(model.UserAlreadyExistsError);
    }
  })
  .catch(err => {
    res.status(400).json(err);
  });
}

exports.currentUser = function(req, res){
  if(!req.user){
    res.status(403).json({
      error:"not authenticated"
    });
  } else {
    res.status(200).json(req.user);
  }
}

exports.getBucket = function(req, res) {
  console.log('Fetching bucket for user with id: ', req.params);
  model.getBucket(req.params.bucketId).then(bucket => {
    if(bucket.userId !== req.user.id){
      res.json({
        status: 'error',
        message: "this bucket doesn't belog to you."
      }).status(403);
    } else {
      res.json(bucket).status(200);
    }
  });
}

exports.buckets = function(req, res) {
  console.log('Fetching buckets for user with id: ', req.user);
  model.getBuckets(req.user.id)
    .then(buckets => {
      res.json({data: buckets}).status(200);
    });
}

exports.createBucket = function(req, res) {
  console.error('user: ', req.user, 'is creating bucket', req.body.name);
  model.createBucketForUser(req.user.id, req.body.name)
    .then(bucket => {
      console.error('success creating bucket: ', bucket);
      res.json(bucket).status(200);
    })
    .catch(err => {
      console.error('Error creating bucket: ', err);
      res.json(err).status(500)
    });
}

exports.deleteBucket = function(req, res) {
  console.error('user: ', req.user, 'is deleting bucket', req.params.bucketId);
  model.getBucket(req.params.bucketId).then(bucket => {
    if(bucket.userId !== req.user.id){
      res.json({
        status: 'error',
        message: "this bucket doesn't belog to you."
      }).status(403);
    } else {
      model.deleteBucket(bucket.id)
        .then(bucket => {
          console.error('success deleting bucket: ', req.params.bucketId);
          res.status(204);
        })
        .catch(err => {
          console.error('Error deleting bucket: ', err);
          res.json(err).status(500)
        });
    }
  });
}
