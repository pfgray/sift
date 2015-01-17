'use strict';

var React = require('react/addons');
var ButtonToolbar = require('react-bootstrap/ButtonToolbar');
var Button = require('react-bootstrap/Button');

var Menu = React.createClass({
  render: function() {
    return (
      <div className='menu'>
        This is the menu!
        <ButtonToolbar>
            <Button>Default</Button>
        </ButtonToolbar>
      </div>
    );
  }
});

module.exports = Menu;
