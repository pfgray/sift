'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('bootstrap/dist/css/bootstrap.css');
require('font-awesome/css/font-awesome.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');
var Intro = require('./intro/Intro.js');

var CaliperStoreApp = React.createClass({
  render: function() {
    return (
      <Intro />
    );
  }
});

module.exports = CaliperStoreApp;
