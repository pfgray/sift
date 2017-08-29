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
    password: req.body.password
  })
  .then(([user, bucket]) => {
    console.log('created user: ', user)
    req.login(user, () => {
      res.json({user, bucket}, 200);
    });
  })
  .catch(err => {
    console.log('#######got err:', err);
    res.json(err, 400);
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
      res.json(buckets).status(200);
    })
    .catch(err => {
      console.error('Error creating bucket: ', err);
      res.json(err).status(500)
    });
}
