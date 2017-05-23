import React from 'react';
import { findDOMNode } from 'react-dom';
import Event from './Event.js';
import eventService from './EventService.js';
import Message from './Message.js';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';
import StreamFilters from './StreamFilters';
import _ from 'lodash';
import batch from './batch';

require('./console.less');

const EventTypes = ['LoggedIn', 'LoggedOut', 'NavigatedTo'];

function after(s, c) {
  return s ? s.substring(s.lastIndexOf(c) + 1) : '';
}

const uniqueTypes = (events) => {
  const toReturn = events
    .reduce((types, event) => {
      // console.log('looking at event: ', event.props);
      const action = after(event.props.action, '#');
      if(types.indexOf(action) !== -1){
        return types;
      } else {
        return types.concat([action]);
      }
    }, []);
    // console.log('computed unique events: ', toReturn);
    return toReturn;
}

const initialFilters = {
  name: "",
  id: "",
  types: EventTypes.reduce((types, type)  => ({
    ...types,
    [type]: true
  }), {})
}

console.log("#### event types:", initialFilters);

var EventStream = React.createClass({
  addEvent:function(event){
    this.addEvents([event]);
  },
  addEvents: function(events) {
    const messages =
      events.map(event => ({
        comp: Event,
        props: event.caliperObject
      }));
    const types = uniqueTypes(messages).reduce((types, t) => ({...types,[t]:true}), {});
    this.setState(prevState => ({
      log: prevState.log.concat(messages),
      filters: {
        ...prevState.filters,
        types: {
          ...types,
          ...prevState.filters.types
        }
      }
    }));
  },
  getInitialState: function() {
    return {
      log: [],
      filters: initialFilters
    };
  },
  initiateEventListener:function(stream){
    this.eventListener = batch(this.addEvents, 250);
    if(stream){
      stream.on('event', this.eventListener);
    }
  },
  removeEventListener: function(){
    if(this.props.eventStream){
      this.props.eventStream.removeEventListener('event', this.eventListener);
    }
  },
  componentDidMount: function(){

    this.initiateEventListener(this.props.eventStream);
    this.addEvents(eventService.getCachedEvents());
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
    if(log.comp === Event){
      const currAction = after(log.props.action, '#')
      const actionIsMatched = this.state.filters.types[currAction];

      const actorIsMatched = log.props.actor.id.indexOf(this.state.filters.id) !== -1;
      return actionIsMatched && actorIsMatched;
    } else {
      return true;
    }
  },
  render: function() {
    // compute the filters?
    return (
        <div>
          <StreamFilters onFilterUpdate={this.updateFilter} filters={this.state.filters} />
          <div className='console'>
            <Message message={"connecting to: [" + window.location.origin + "]..."}/>
            <Message message={"[connected]"} className="success" />
            {this.state.log.filter(this.logShouldBeShown).map((m, i) => <m.comp {...m.props} key={m.props.eventTime + m.props.action + m.props.actor.id} />)}
            <div className="console-footer">
              <Button onClick={this.clear} className="outline" bsStyle="default">clear</Button>
            </div>
          </div>
        </div>
    );
  }
});

module.exports = EventStream;
