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
var UserProfile = require('./UserProfile.js');
var CryptoJS = require('crypto-js');
var eventService = require('./EventService.js');
var dates = require('./DateService.js');

require ('./dashboard.less');

var Dashboard = React.createClass({
  mixins: [ Router.Navigation, Router.State ],
  getInitialState: function() {
    return {user:null,totalEvents:null,eventStream:null};
  },
  incrementEventCount: function(event){
    this.setState({
      totalEvents: this.state.totalEvents+1
    });
  },
  componentDidMount:function(){
    var MINUTE_COUNT = 5;
    eventService.getCurrentUserAndEventCount(dates.getMinutesInPast(MINUTE_COUNT), function(user, eventCount){
        //initiate stream
        var stream = eventService.getEventStreamForUser(user);
        stream.on('event', this.incrementEventCount);

        this.setState({
            user:user,
            totalEvents: eventCount.totalEvents,
            eventsPerMinute: eventCount.totalEventsAfterDate / MINUTE_COUNT,
            eventStream:stream
        });
    }.bind(this), function(error){
        this.transitionTo('/');
    }.bind(this));
  },
  componentWillUnmount: function(){
    this.state.eventStream.removeEventListener('event', this.incrementEventCount);
  },
  render: function() {
    var profile;
    if(this.state.user){
        profile = (
          <div>
            <UserProfile user={this.state.user} />
            <Total label="Total events captured:" total={this.state.totalEvents} className="events" />
            <Total label="Events per minute:" total={this.state.eventsPerMinute} className="events-per-minute" />

            <div className="code-block">
              {
                this.isActive('graphs') ?
                  <Link to="eventstream"><Button><i className="fa fa-tasks"></i> Stream</Button></Link>:
                  <Link to="graphs"><Button><i className="fa fa-area-chart"></i> Graph</Button></Link>
              }
            </div>
          </div>
        )
    } else {
        //TODO: add loading icon here?
        profile = (<div></div>)
    }
    return (
      <div>
        <div className="dash-sidebar">
          {profile}
        </div>
        <div className="dash-main">
          <RouteHandler user={this.state.user} eventStream={this.state.eventStream}/>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
