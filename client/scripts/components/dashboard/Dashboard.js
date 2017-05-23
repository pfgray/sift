import React from 'react';
import { Route, Link } from 'react-router';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';
import Total from './Total.js';
import UserProfile from './UserProfile.js';
import eventService from './events/EventService.js';
import dates from './DateService.js';
import batch from './events/batch';

import './dashboard.less';

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      user:null,
      totalEvents:null,
      eventStream:null,
      initiated:false,
      sidebarOpen: true, //todo: save this in localstorage
    };
  },
  incrementEventCount: function(count){
    this.setState({
      totalEvents: this.state.totalEvents + count
    });
  },
  toggleSidebar: function() {
    this.setState(prev => ({
      sidebarOpen: !prev.sidebarOpen
    }));
  },
  componentDidMount:function(){
    var MINUTE_COUNT = 5;
    eventService.getCurrentUserAndEventCount(dates.getMinutesInPast(MINUTE_COUNT), function(user, eventCount){
        //initiate stream
        var stream = eventService.getEventStreamForUser(user, function(initialEvents){
            this.setState({
                initiated:true
            });
        }.bind(this));
        const eventListener = batch(arr => this.incrementEventCount(arr.length), 1000);
        stream.on('event', eventListener);

        this.setState({
            user:user,
            totalEvents: eventCount.totalEvents,
            eventsPerMinute: eventCount.totalEventsAfterDate / MINUTE_COUNT,
            eventStream:stream
        });
    }.bind(this), function(error){
        this.transitionTo('intro');
    }.bind(this));
  },
  componentWillUnmount: function(){
    if(this.state.eventStream){
      this.state.eventStream.removeEventListener('event', this.incrementEventCount);
    }
  },
  render: function() {
    var profile, subRoute;
    if(this.state.user){
        profile = (
          <div>
            <div className='collapse-container'>
                <i className="fa fa-chevron-right" aria-hidden="true" onClick={this.toggleSidebar}></i>
            </div>
            <div className="hide-closed">
                <UserProfile user={this.state.user} />
                <Total label="Total events captured:" total={this.state.totalEvents} className="events" />
                <Total label="Events per minute:" total={this.state.eventsPerMinute} className="events-per-minute" />
            </div>
{/*}
            <div className="code-block">
              {
                this.isActive('graphs') ?
                  <Link to="dashboard"><Button><i className="fa fa-tasks"></i> Stream</Button></Link>:
                  <Link to="graphs"><Button><i className="fa fa-area-chart"></i> Graph</Button></Link>
              }
            </div>
*/}
          </div>
        );
        subRoute = !this.state.initiated ?
            (<div className="subroute-spinner"><i className="fa fa-refresh fa-spin"></i></div>) :
            (React.cloneElement(this.props.children, {
              user: this.state.user,
              eventStream: this.state.eventStream
            }))
    } else {
        //TODO: add loading icon here?
        profile = (<div className="sidebar-spinner"><i className="fa fa-refresh fa-spin"></i></div>)
        subRoute = (<div />);
    }
    return (
      <div>
        <div className={"dash-sidebar" + (this.state.sidebarOpen ? ' open' : '')}>
          {profile}
        </div>
        <div className="dash-main">
          <div className='console-wrapper'>
            {subRoute}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
