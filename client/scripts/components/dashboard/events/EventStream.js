'use strict';

var React = require('react/addons');
var Event = require('./Event.js');
var Message = require('./Message.js');
var _ = require('lodash');

require('./console.less');

var EventStream = React.createClass({
  eventSocket:null,
  eventSocketListener:function(event){
    console.log('got event: ', event);
    this.state.log.push(new Event(event));
  },
  getInitialState: function() {
    //TODO: I think it may be bad to
    // store heavy React components
    // in this object's state.
    return {log: []};
  },
  componentDidMount: function(){
  },
  componentWillReceiveProps: function(nextProps){
    if(nextProps.user){
      this.eventSocket = io();
      this.state.log.push(new Message("connecting to: [" + window.location.origin + "]..."));
      console.log('log now contains: ', this.state.log);
      this.eventSocket.on('event', this.eventSocketListener);
      this.eventSocket.emit('connectStream', nextProps.user.apiKey);
      this.state.log.push(new Message("[connected]", "success"));
    }
  },
  componentWillUnmount: function(){
    if(this.eventSocket){
      this.eventSocket.removeListener('event', this.eventSocketListener);
    }
  },
  render: function() {
    return (
      <div className='console-wrapper'>
        <div className='console'>
          {this.state.log}
        </div>
      </div>
    );
  }
});

module.exports = EventStream;
