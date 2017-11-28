import React from 'react';
import { Route, Link } from 'react-router';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';
import Total from './Total.js';
import BucketProfile from './BucketProfile.js';
import dates from './DateService.js';
import batch from './events/batch';

import './dashboard.less';

var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      sidebarOpen: true //todo: save this in localstorage
    };
  },
  incrementEventCount: function(count){
    // this.setState({
    //   totalEvents: this.state.totalEvents + count
    // });
  },
  toggleSidebar: function() {
    this.setState(prev => ({
      sidebarOpen: !prev.sidebarOpen
    }));
  },
  componentDidMount:function(){
    // var MINUTE_COUNT = 5;
    // eventService.getCurrentUserAndEventCount(dates.getMinutesInPast(MINUTE_COUNT), function(user, eventCount){
    //     //initiate stream
    //     var stream = eventService.getEventStreamForUser(user, function(initialEvents){
    //         this.setState({
    //             initiated:true
    //         });
    //     }.bind(this));
    //     const eventListener = batch(arr => this.incrementEventCount(arr.length), 1000);
    //     stream.on('event', eventListener);

    //     this.setState({
    //         user:user,
    //         totalEvents: eventCount.totalEvents,
    //         eventsPerMinute: eventCount.totalEventsAfterDate / MINUTE_COUNT,
    //         eventStream:stream
    //     });
    // }.bind(this), function(error){
    //     this.transitionTo('intro');
    // }.bind(this));
  },
  componentWillUnmount: function(){
    // if(this.state.eventStream){
    //   this.state.eventStream.removeEventListener('event', this.incrementEventCount);
    // }
  },
  render: function() {
    return (
      <div className='dash-container'>
        <div className={"dash-sidebar" + (this.state.sidebarOpen ? ' open' : '')}>
          <div>
            <div className='collapse-container'>
              <i className="fa fa-chevron-right" aria-hidden="true" onClick={this.toggleSidebar}></i>
            </div>
            <div className="hide-closed">
               <BucketProfile bucket={this.props.bucket}/>
            </div>
          </div>
        </div>
        <div className="dash-main">
          <div className='console-wrapper'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Dashboard;
