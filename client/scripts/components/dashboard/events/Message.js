'use strict';

var React = require('react');

var Message = React.createClass({
  render: function() {
    return (
      <div className={"message " + (this.props.className ? this.props.className : '')}>
        {this.props.message}
      </div>
    );
  }
});

module.exports = Message;
