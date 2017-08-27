const express = require('express');
const controller = require('./user.controller');
const passport = require('passport');

const router = express.Router();

router.post('/signup', controller.signup);
router.post('/login', passport.authenticate('local'), controller.login);
router.get('/me', controller.currentUser);
router.get('/buckets', controller.buckets);
router.post('/buckets', controller.createBucket);
router.get('/buckets/:bucketId', controller.getBucket);

module.exports = router;
