'use strict';

var React = require('react/addons');
var Router = require('react-router');
var { Route, DefaultRoute, RouteHandler, Link } = Router;
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var Grid = require('react-bootstrap/Grid');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Button = require('react-bootstrap/Button');
var Total = require('./Total.js');
var $ = require('jquery');
var CryptoJS = require('crypto-js');

require ('./dashboard.less');

var Dashboard = React.createClass({
  mixins: [ Router.Navigation ],
  getInitialState: function() {
    return {user:null,totalEvents:null};
  },
  componentDidMount:function(){
    var pastMinutes = 5;
    var pastDate = JSON.stringify(new Date((new Date()).getTime() - pastMinutes * 60000));
    $.when($.ajax("/api/me"), $.ajax("/api/me/eventCount?afterDate=" + pastDate))
    .done(function(user, eventCount){
        user = user[0];
        eventCount = eventCount[0];
        console.log('I am:', user, 'with number of events: ', eventCount);
        user.profilePic = 'http://www.gravatar.com/avatar/' + CryptoJS.MD5(user.emails[0].value);
        user.eventsUrl = window.location.origin + '/api/users/' + user._id + '/events';
        //TODO: dynamically change eventsPerMinute every 15 seconds or so...
        this.setState({
            user:user,
            totalEvents: eventCount.totalEvents,
            eventsPerMinute: eventCount.totalEventsAfterDate / pastMinutes
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
            <div className="code-block">
              <div className="code-label">Api key:</div>
              <div><code>{this.state.user.apiKey}</code></div>
            </div>
            <div className="code-block">
              <div className="code-label">Events endpoint:</div>
              <div><code>{this.state.user.eventsUrl}</code></div>
            </div>
            <div className="code-block">
              <div className="code-label">Sample curl:</div>
              <div><code>curl -X POST \<br />
                  &nbsp;&nbsp;{this.state.user.eventsUrl} \<br />
                  &nbsp;&nbsp;-H "Authorization: {this.state.user.apiKey}" \<br />
                  &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                  &nbsp;&nbsp;--data @/path/to/event.json
              </code></div>
            </div>
            <Total label="Total events captured:" total={this.state.totalEvents} className="events" />
            <Total label="Events per minute:" total={this.state.eventsPerMinute} className="events-per-minute" />

            <div className="code-block">
              <Button disabled><i className="fa fa-area-chart"></i> Graph</Button>
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
