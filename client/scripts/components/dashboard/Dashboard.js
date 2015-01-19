'use strict';

var React = require('react/addons');
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var Grid = require('react-bootstrap/Grid');
var ButtonGroup = require('react-bootstrap/ButtonGroup');
var Button = require('react-bootstrap/Button');

var Intro = React.createClass({
  getInitialState: function() {
    return {};
  },
  render: function() {
    return (
      <Grid>
        <Row>
          <Col xs={12} md={6} mdOffset={3}>This is the dashboard</Col>
        </Row>
        <Row>
        </Row>
        <Row>
          <Col xs={12} md={6} mdOffset={3}>
              <Button className="branded-login" bsStyle="info">yessss</Button>
          </Col>
        </Row>
      </Grid>
    );
  }
});

module.exports = Intro;
