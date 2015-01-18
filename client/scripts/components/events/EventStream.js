'use strict';

var React = require('react/addons');
var Event = require('./Event.js');

var EventStream = React.createClass({
  getInitialState: function() {
    return {events: []};
  },
  componentDidMount: function() {
    var socket = io();
    socket.on('event', function(event){
      var eventCount = this.state.events.length;
      this.state.events.push(event);
      this.setState({events:this.state.events})
    }.bind(this));
  },
  render: function() {
    var events = this.state.events.map(function(event){
      return (<Event message={event.message} />);
    });
    return (
      <div className='menu'>
        {events}
      </div>
    );
  }
});

module.exports = EventStream;
