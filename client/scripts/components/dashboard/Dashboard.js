'use strict';

var React = require('react/addons');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var Grid = require('react-bootstrap/Grid');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Button = require('react-bootstrap/Button');
var $ = require('jquery');
var CryptoJS = require('crypto-js');

require ('./dashboard.less');

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
        user.eventsUrl = window.location.origin + '/api/users/' + user._id + '/events';
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
              <img src={this.state.user.profilePic + '?s=200'} />
              <span className="name">{this.state.user.displayName}</span>
            </div>
            <div className="codeBlock">
              <div className="code-label">Api key:</div>
              <div><code>{this.state.user.apiKey}</code></div>
            </div>
            <div className="codeBlock">
              <div className="code-label">Events endpoint:</div>
              <div><code>{this.state.user.eventsUrl}</code></div>
            </div>
            <div className="codeBlock">
              <div className="code-label">Sample curl:</div>
              <div><code>curl -X POST \<br />
                  &nbsp;&nbsp;{this.state.user.eventsUrl} \<br />
                  &nbsp;&nbsp;-H "Authorization: {this.state.user.apiKey}" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;--data @/path/to/event.json
              </code></div>
            </div>
          </div>
        )
    } else {
        profile = (
           <div></div>
        )
    }
    return (
      <div>
        <div className="dash-sidebar">
          {profile}
        </div>
        <div className="dash-main">
          <RouteHandler user={this.state.user}/>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
