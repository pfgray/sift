'use strict';

import React from 'react';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';

require('./intro.css');

var Intro = React.createClass({
  getInitialState: function() {
    return {};
  },
  signInGoogle: function(event) {
    window.location = "/auth/google";
  },
  signInAnon: function(event) {
    window.location = "/auth/anonymous";
  },
  render: function() {
    return (
      <Grid>
        <Row className="intro-header">
          <Col xs={12} md={6} mdOffset={3}>caliper</Col>
        </Row>
        <Row className="intro-subheader">
        </Row>
        <Row className="intro-login">
          <Col xs={12} md={6} mdOffset={3}>
              <Button onClick={this.signInGoogle} className="branded-login" bsStyle="info"><i className="fa fa-google"></i>Sign In with Google</Button>
          </Col>
        </Row>
        <Row className="intro-login">
          <Col xs={12} md={6} mdOffset={3}>
              <Button onClick={this.signInAnon} className="branded-login" bsStyle="default"><i className="fa fa-user"></i>Use Anonymously</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Intro;
