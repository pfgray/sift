import React from 'react';
import { Col, Row, Grid, ButtonGroup, Button } from 'react-bootstrap';

import Logo from '../logo';

import './intro.less';

const Brand = ({children}) => (
  <div className="brand-container">
    <Grid>
      <Row>
        <Col xs={12} sm={6} smOffset={3} className="brand-front logo-container">
          {/* <Logo /> */}
          <h1>sift</h1>
        </Col>
      </Row>
      {React.Children.map(children, child => (
        <Row>
          <Col xs={12} sm={4} smOffset={4} className="brand-front">
            {child}
          </Col>
        </Row>
      ))}
    </Grid>
  </div>
);

module.exports = Brand;
