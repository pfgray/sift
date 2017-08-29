'use strict';

import React from 'react';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';

require('./intro.css');

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
      <Grid>
        <Row className="intro-header">
          <Col xs={12} md={6} mdOffset={3}>sift</Col>
        </Row>
        <Row className="intro-subheader">
        </Row>
        <Row className="intro-login">
          <Col xs={12} md={6} mdOffset={3}>
              <Button onClick={this.signInGoogle} className="branded-login" bsStyle="info">Log In / Sign Up</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Intro;
