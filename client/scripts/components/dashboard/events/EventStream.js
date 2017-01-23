'use strict';

var React = require('react/addons');
var Event = require('./Event.js');
var eventService = require('./EventService.js');
var Message = require('./Message.js');
var _ = require('lodash');

require('./console.less');

var EventStream = React.createClass({
  addEvent:function(event){
    this.addEvents([event]);
  },
  addEvents:function(events) {
    console.log('Adding events: ', events)
    const messages =
      events.filter(e => _.isArray(e.caliperObject.data))
      .map(event => {
        console.log('Mapping: ', event);
        return event.caliperObject.data.map(data => ({
          comp: Event,
          props: data
        }))
      }).reduce((arr, i) => arr.concat(i), []);
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
      stream.on('event', e => {
        console.log('Streaming event: ', e);
        this.addEvent(e);
      });
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
        {this.state.log.map((m, i) => <m.comp {...m.props} key={i} />)}
      </div>
    );
  }
});

module.exports = EventStream;
