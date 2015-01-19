'use strict';

var React = require('react/addons');

var Message = React.createClass({
  render: function() {
    return (
      <div className={"message " + (this.props.data.className ? this.props.data.className : '')}>
        {this.props.data.message}
      </div>
    );
  }
});

module.exports = function(message, className){
  return React.createElement(Message, {data: {message:message, className:className}});
}
