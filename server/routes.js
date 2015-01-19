/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var passport = require('passport');

module.exports = function(app, socketio) {

  // Insert routes below
  app.use('/api/events', require('./api/events').router);
  app.use('/api', require('./api/user'));
  require('./api/events').dispatcher(socketio);

  // Redirect the user to Google for authentication.  When complete, Google
  // will redirect the user back to the application at
  //     /auth/google/return
  app.get('/auth/google', passport.authenticate('google'));

  // Google will redirect the user to this URL after authentication.  Finish
  // the process by verifying the assertion.  If valid, the user will be
  // logged in.  Otherwise, authentication has failed.
  app.get('/auth/google/return',
    passport.authenticate('google', {
      successRedirect: '/dashboard',
      failureRedirect: '/'
    })
  );


  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|public)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      console.log('showing the index file:');
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
