'use strict';

var React = require('react');
var ButtonToolbar = require('react-bootstrap/ButtonToolbar');
var Button = require('react-bootstrap/Button');

var Menu = React.createClass({
  render: function() {
    return (
      <div className='menu'>
        This is the menu!
        <ButtonToolbar>
            <Button>Default</Button>
            <a href="/auth/google">Sign In with Google</a>
        </ButtonToolbar>
      </div>
    );
  }
});

module.exports = Menu;
