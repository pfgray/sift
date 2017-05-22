import React from 'react';
import { findDOMNode } from 'react-dom';
import Event from './Event.js';
import eventService from './EventService.js';
import Message from './Message.js';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';
import StreamFilters from './StreamFilters';
import _ from 'lodash';

require('./console.less');

const EventTypes = ['LoggedIn', 'LoggedOut', 'NavigatedTo'];

const initialFilters = {
  name: "",
  id: "",
  types: EventTypes.map(t => ({
    visible: true,
    type: t
  }))
}

var EventStream = React.createClass({
  addEvent:function(event){
    this.addEvents([event]);
  },
  addEvents:function(events) {
    const messages =
      events.map(event => ({
        comp: Event,
        props: event.caliperObject
      }));
    this.setState({
      log: this.state.log.concat(messages)
    });
  },
  getInitialState: function() {
    return {
      log: [],
      filters: initialFilters
    };
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
  clear: function() {
    this.setState({
      log: []
    });
  },
  updateFilter: function(filters){
    this.setState({
      filters
    });
  },
  logShouldBeShown: function(log) {
    // is the type in any visible types?
    // this.state.filters.types.some(t => t.type === )
    if(log.comp === Event){
      const actionIsMatched = this.state.filters.types.some(t => {
        return t.visible && log.props.action.indexOf(t.type) !== -1;
      });
      const actorIsMatched = log.props.actor.id.indexOf(this.state.filters.id) !== -1;
      return actionIsMatched && actorIsMatched;
    } else {
      return true;
    }
  },
  render: function() {
    return (
        <div>
          <StreamFilters onFilterUpdate={this.updateFilter} initialFilters={initialFilters} eventTypes={EventTypes}/>
          <div className='console'>
            {this.state.log.filter(this.logShouldBeShown).map((m, i) => <m.comp {...m.props} key={i} />)}
            <div className="console-footer">
              <Button onClick={this.clear} className="outline" bsStyle="default">clear</Button>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = EventStream;
