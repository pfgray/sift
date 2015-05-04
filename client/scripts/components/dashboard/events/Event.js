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
    //support the new envelope, eventually this will be the default,
    // but for now we need to stll support the poc code.
    var caliperObject = this.props.data.caliperObject;
    console.log('got data:', caliperObject);
    if(caliperObject['@context'] === 'http://purl.imsglobal.org/caliper/ctx/v1/Envelope'){
        caliperObject = caliperObject.data[0];//lol, todo: make this better
    }
    console.log('now going with caliperObject: ', caliperObject);
    var event = caliperObject['@type'];
    var action = caliperObject.action || '';
    var actor = caliperObject.actor ? caliperObject.actor.name : '';

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
