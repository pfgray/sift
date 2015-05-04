'use strict';

var React = require('react/addons');
var Event = require('./Event.js');
var eventService = require('./EventService.js');
var Message = require('./Message.js');
var _ = require('lodash');

require('./console.less');

var EventStream = React.createClass({
  addEvent:function(event){
      this.state.log.push(new Event(event));
      this.setState({});
  },
  addEvents:function(events){
      events.forEach(function(event){
          this.state.log.push(new Event(event));
      }.bind(this));
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
    this.addEvents(eventService.getCachedEvents());
  },
  componentWillReceiveProps: function(nextProps){
    this.removeEventListener();
    this.initiateEventListener(nextProps.eventStream);
  },
  componentWillUnmount: function(){
    this.removeEventListener();
  },
  componentWillUpdate: function() {
    var node = this.getDOMNode();
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = this.getDOMNode();
      node.scrollTop = node.scrollHeight;
    }
  },
  render: function() {
    return (
      <div className='console'>
        {this.state.log}
      </div>
    );
  }
});

module.exports = EventStream;
