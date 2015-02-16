'use strict';

var React = require('react/addons');
var Event = require('./Event.js');
var Message = require('./Message.js');
var _ = require('lodash');

require('./console.less');

var EventStream = React.createClass({
  eventSocketListener:function(event){
    this.state.log.push(new Event(event));
    this.setState({});
  },
  getInitialState: function() {
    //TODO: I think it may be bad to
    // store heavy React components
    // in this object's state.
    return {log: []};
  },
  componentDidMount: function(nextProps){
    this.state.log.push(new Message("connecting to: [" + window.location.origin + "]..."));
    this.state.log.push(new Message("[connected]", "success"));
  },
  componentWillReceiveProps: function(nextProps){
    if(!this.props.eventStream){
      nextProps.eventStream.on('event', this.eventSocketListener);
    }
  },
  componentWillUnmount: function(){
    if(this.props.eventStream){
      this.props.eventStream.removeListener('event', this.eventSocketListener);
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
