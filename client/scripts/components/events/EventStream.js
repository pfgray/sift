'use strict';

var React = require('react/addons');
var Event = require('./Event.js');
var _ = require('lodash');

var EventStream = React.createClass({
  getInitialState: function() {
    return {events: []};
  },
  componentDidMount: function() {
    var socket = io();
    socket.on('event', function(eventList){
      console.log('got events: ', eventList);
      _.each(eventList, function(event){
          this.state.events.push(event);
      }.bind(this));
      this.setState({events:this.state.events})
    }.bind(this));
  },
  render: function() {
    var events = this.state.events.map(function(event){
      return (<Event data={event} />);
    });
    return (
      <div className='menu'>
        {events}
      </div>
    );
  }
});

module.exports = EventStream;
