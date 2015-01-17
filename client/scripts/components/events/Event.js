'use strict';

var React = require('react/addons');

var Event = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.message}
      </div>
    );
  }
});

module.exports = Event;
