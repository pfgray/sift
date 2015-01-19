'use strict';

var React = require('react/addons');
var Router = require('react-router');
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var Grid = require('react-bootstrap/Grid');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Button = require('react-bootstrap/Button');
var $ = require('jquery');
var CryptoJS = require('crypto-js');

require ('./dashboard.css');

var Dashboard = React.createClass({
  mixins: [ Router.Navigation ],
  getInitialState: function() {
    return {user:null};
  },
  componentDidMount:function(){
    $.ajax({
      url: "/api/me"
    }).done(function(user){
      console.log('I am:', user);
      user.profilePic = 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(user.emails[0].value);
      this.setState({
        user:user
      });
    }.bind(this))
    .fail(function(error){
      this.transitionTo('/');
    }.bind(this));
  },
  render: function() {
    return (
      <div className="dash-sidebar">
        <div className="user">
          <img src={this.state.user ? this.state.user.profilePic : ''} />
          <span className="name">{this.state.user ? this.state.user.displayName : ''}</span>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
