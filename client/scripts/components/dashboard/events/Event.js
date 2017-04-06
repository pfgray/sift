'use strict';

var React = require('react');
var moment = require('moment');

function after(s, c) {
    return s ? s.substring(s.lastIndexOf(c) + 1) : '';
}

var Event = React.createClass({
  getInitialState: function(){
    return {jsonVisible:false};
  },
  switchJson: function(){
  	this.setState({
  		jsonVisible: !this.state.jsonVisible
  	});
  },
  render: function() {

    //support the new envelope, eventually this will be the default,
    // but for now we need to stll support the poc code.
    var action = this.props.action || '';
    var actor = this.props.actor ? after(this.props.actor['@id'], '/') : '';
    var actorType = this.props.actor ? after(this.props.actor['@type'], '/') : '';
    var object = this.props.object ? this.props.object['@type'] : '';
    var objectText = after(object, '/');

    var objectLabel = this.props.object ? `${objectText}`: '';
    var actionLabel = after(action, '#');

    return (
      <div>
        <div className='event' onClick={() => this.switchJson()}>
          <span className='actor'>{`${actorType} / ${actor}`}</span>
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
