'use strict';

var React = require('react');
var moment = require('moment');

var Event = React.createClass({
  getInitialState: function(){
    return {jsonVisible:false};
  },
  switchJson: function(){
  	console.log('got called...');
  	this.setState({
  		jsonVisible: !this.state.jsonVisible
  	});
  },
  render: function() {
    console.log("Now rendering Event: ", this.props);
    //support the new envelope, eventually this will be the default,
    // but for now we need to stll support the poc code.
    var action = this.props.action || '';
    var actor = this.props.actor ? this.props.actor['@id'] : '';
    var object = this.props.object ? this.props.object['@type'] : '';
    var objectText = object ? object.substring(object.lastIndexOf("/") + 1) : '';

    var objectLabel = this.props.object ? `${objectText} (${this.props.object['@id']})`: '';
    var actionLabel = action ? action.substring(action.lastIndexOf("#") + 1) : '';

    return (
      <div>
        <div className='event' onClick={() => this.switchJson()}>
          <span className='actor'>{actor}</span>
          <span className='action'>{actionLabel}</span>
          <span className='type'>{objectLabel}</span>
          <span className='time'>{moment(this.props.eventTime).format('MMMM Do YYYY, h:mm:ss a')}</span>
        </div>
        <pre className={this.state.jsonVisible ? 'event-json' : 'hidden'}>
          {JSON.stringify(this.props, null, 2)}
        </pre>
      </div>
    );
  }
});

module.exports = Event;
