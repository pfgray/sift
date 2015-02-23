'use strict';

var React = require('react/addons');
var moment = require('moment');

var Event = React.createClass({
  render: function() {
    return (
      <div>
        <span>{this.props.data.caliperObject['@type']}</span>
        <span className='time'>{moment(this.props.data.recieved).format('MMMM Do YYYY, h:mm:ss a')}</span>
      </div>
    );
  }
});

module.exports = function(event){
  return React.createElement(Event, {data: event});
};
