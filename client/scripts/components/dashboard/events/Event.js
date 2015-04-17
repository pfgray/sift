'use strict';

var React = require('react/addons');
var moment = require('moment');

var Event = React.createClass({
  getInitialState: function(){
    return {jsonVisible:false};
  },
  switchJson:function(){
  	console.log('got called...');
  	this.setState({
  		jsonVisible: !this.state.jsonVisible
  	});
  },
  render: function() {
    var event = this.props.data.caliperObject['@type'];
    var action = this.props.data.caliperObject['action'] || '';
    var actor = this.props.data.caliperObject.actor ? this.props.data.caliperObject.actor.name : '';

    var eventLabel = event ? event.substring(event.lastIndexOf("/") + 1) : '';
    var actionLabel = action ? action.substring(action.lastIndexOf("#") + 1) : '';

    return (
      <div>
        <div className='event'>
          <span onClick={this.switchJson} className='type'>{eventLabel}</span>
          <span className='action'>{actionLabel}</span>
          <span className='actor'>{actor}</span>
          <span className='time'>{moment(this.props.data.recieved).format('MMMM Do YYYY, h:mm:ss a')}</span>
        </div>
        <pre className={this.state.jsonVisible ? 'event-json' : 'hidden'}>
          {JSON.stringify(this.props.data.caliperObject, null, 2)}
        </pre>
      </div>
    );
  }
});

module.exports = function(event){
  return React.createElement(Event, {data: event});
};
