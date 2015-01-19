'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var Grid = require('react-bootstrap/Grid');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Button = require('react-bootstrap/Button');
var $ = require('jquery');

require ('./dashboard.css');

var Dashboard = React.createClass({
  mixins: [ Router.Navigation ],
  getInitialState: function() {
    return {};
  },
  componentDidMount:function(){
    $.ajax({
      url: "/api/me"
    }).done(function(user){
      console.log('I am:', user);
    }.bind(this))
    .fail(function(error){
      this.transitionTo('/');
    }.bind(this));
  },
  render: function() {
    return (
      <div className="dash-sidebar">
        This is the dashbar!
      </div>
    );
  }
});

module.exports = Dashboard;
