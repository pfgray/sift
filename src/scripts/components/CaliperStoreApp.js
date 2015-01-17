'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.TransitionGroup;

// Export React so the devtools can find it
(window !== window.top ? window.top : window).React = React;

// CSS
require('../../styles/normalize.css');
require('bootstrap/dist/css/bootstrap.css');
require('../../styles/main.css');

var imageURL = require('../../images/yeoman.png');
var Col = require('react-bootstrap/Col');
var Row = require('react-bootstrap/Row');
var Grid = require('react-bootstrap/Grid');
var Menu = require('./menu/Menu.js');
var EventStream = require('./events/EventStream.js');

var CaliperStoreApp = React.createClass({
  render: function() {
    return (
      <div className='main'>
        <ReactTransitionGroup transitionName="fade">
          <Menu />
        </ReactTransitionGroup>
        <Grid>
          <Row>
            <Col xs={12} md={8}>
              <EventStream />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

module.exports = CaliperStoreApp;
