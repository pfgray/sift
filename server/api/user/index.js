const express = require('express');
const controller = require('./user.controller');
const passport = require('passport');

const router = express.Router();

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), controller.login)
router.post('/signup', controller.signup);
router.get('/me', controller.currentUser);

module.exports = router;
