'use strict';

var React = require('react/addons');
var Event = require('./Event.js');
var Message = require('./Message.js');
var _ = require('lodash');

require('./console.less');

var EventStream = React.createClass({
  addEvent:function(event){
      this.state.log.push(new Event(event));
      this.setState({});
  },
  getInitialState: function() {
    //TODO: I think it may be bad to
    // store heavy React components
    // in this object's state.
    return {log: []};
  },
  initiateEventListener:function(stream){
    if(stream){
      stream.on('event', this.addEvent);
    }
  },
  removeEventListener:function(){
    if(this.props.eventStream){
      this.props.eventStream.removeEventListener('event', this.addEvent);
    }
  },
  componentDidMount: function(){
    this.state.log.push(new Message("connecting to: [" + window.location.origin + "]..."));
    this.state.log.push(new Message("[connected]", "success"));
    this.initiateEventListener(this.props.eventStream);
  },
  componentWillReceiveProps: function(nextProps){
    this.removeEventListener();
    this.initiateEventListener(nextProps.eventStream);
  },
  componentWillUnmount: function(){
    this.removeEventListener();
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
