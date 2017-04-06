import React from 'react';
import { findDOMNode } from 'react-dom';
import Event from './Event.js';
import eventService from './EventService.js';
import Message from './Message.js';
import _ from 'lodash';

require('./console.less');

var EventStream = React.createClass({
  addEvent:function(event){
    this.addEvents([event]);
  },
  addEvents:function(events) {
    console.log('Adding events: ', events);
    const messages =
      events.map(event => ({
        comp: Event,
        props: event.caliperObject
      }));
    console.log('Adding events: ', messages ,'to:', this.state.log);
    this.setState({
      log: this.state.log.concat(messages)
    });
  },
  getInitialState: function() {
    return {log: []};
  },
  initiateEventListener:function(stream){
    if(stream){
      stream.on('event', this.addEvent);
    }
  },
  removeEventListener: function(){
    if(this.props.eventStream){
      this.props.eventStream.removeEventListener('event', this.addEvent);
    }
  },
  componentDidMount: function(){
    this.state.log.push({comp: Message, props: {message: "connecting to: [" + window.location.origin + "]..."}});
    this.state.log.push({comp: Message, props: {message: "[connected]", className: "success" }});

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
    var node = findDOMNode(this);
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
  },
  componentDidUpdate: function() {
    if (this.shouldScrollBottom) {
      var node = findDOMNode(this);
      node.scrollTop = node.scrollHeight;
    }
  },
  render: function() {
    return (
      <div className='console'>
        {this.state.log.map((m, i) => <m.comp {...m.props} key={i} />)}
      </div>
    );
  }
});

module.exports = EventStream;
