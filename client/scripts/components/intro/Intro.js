import React from 'react';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';

import Logo from '../logo';

import Brand from './Brand.js';

var Intro = React.createClass({
  getInitialState: function() {
    return {};
  },
  signInGoogle: function(event) {
    this.props.router.push('/login');
  },
  signInAnon: function(event) {
    window.location = "/auth/anonymous";
  },
  render: function() {
    return (
      <Brand>
        <Button onClick={this.signInGoogle} className="branded-login" bsStyle="info">Log In / Sign Up</Button>
      </Brand>    
    );
  }
});

module.exports = Intro;
