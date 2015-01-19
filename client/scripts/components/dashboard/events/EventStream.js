'use strict';

var React = require('react/addons');
var Event = require('./Event.js');
var _ = require('lodash');

var EventStream = React.createClass({
  eventSocket:null,
  eventSocketListener:function(event){
    console.log('got event: ', event);
    this.state.events.push(event);
    this.setState({events:this.state.events});
  },
  getInitialState: function() {
    return {events: []};
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.user){
      this.eventSocket = io();
      this.eventSocket.on('event', this.eventSocketListener);
      this.eventSocket.emit('connectStream', nextProps.user.apiKey);
    }
  },
  componentWillUnmount: function(){
    if(this.eventSocket){
      this.eventSocket.removeListener('event', this.eventSocketListener);
    }
  },
  render: function() {
    var events = this.state.events.map(function(event){
      return (<Event data={event} />);
    });
    return (
      <div className='event-stream'>
        {events}
      </div>
    );
  }
});

module.exports = EventStream;
