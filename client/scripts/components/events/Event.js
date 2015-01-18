'use strict';

var React = require('react/addons');

var Event = React.createClass({
  render: function() {
    return (
      <div>
        {this.props.data.id} | {this.props.data.data['@context']}
      </div>
    );
  }
});

module.exports = Event;
