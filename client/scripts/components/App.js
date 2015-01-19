'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('bootstrap/dist/css/bootstrap.css');
require('font-awesome/css/font-awesome.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');
var Intro = require('./intro/Intro.js');

var App = React.createClass({
  mixins: [ Router.State ],
  render: function() {
    var name = this.getRoutes().reverse()[0].name;
    return (
      <div>
        <RouteHandler key={name}/>
      </div>
    );
  }
});

module.exports = App;
