'use strict';

var React = require('react/addons');

var Event = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.data['@type']}
      </div>
    );
  }
});

module.exports = Event;