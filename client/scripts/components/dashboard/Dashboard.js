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
    var profile;
    if(this.state.user){
        profile = (
          <div>
            <div className="user">
              <img src={this.state.user.profilePic} />
              <span className="name">{this.state.user.displayName}</span>
            </div>
            <div className="codeBlock">
              <div className="code-label">Api Key:</div>
              <div><code>{this.state.user.apiKey}</code></div>
            </div>
          </div>
        )
    } else {
        profile = (
           <div></div>
        )
    }
    return (
      <div className="dash-sidebar">
        {profile}
      </div>
    );
  }
});

module.exports = Dashboard;
