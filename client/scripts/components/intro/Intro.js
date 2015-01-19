'use strict';

var React = require('react/addons');
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var Grid = require('react-bootstrap/Grid');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Button = require('react-bootstrap/Button');

require('./intro.css');

var Intro = React.createClass({
  getInitialState: function() {
    return {};
  },
  signInGoogle: function(event) {
    window.location = "/auth/google";
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
      </Grid>
    );
  }
});

module.exports = Intro;