import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup } from 'react-bootstrap';
import { compose, withState, withProps } from 'recompose';
import classNames from 'classnames';
import axios from 'axios';
import withFetch from '../util/withFetch';
import Dashboard from '../dashboard/Dashboard.js';
import EventStreamDisplay from '../dashboard/events/EventStreamDisplay.js';

function fetchStuff({params}) {
  return axios.get(`/api/buckets/${params.id}`, {withCredentials:true})
      .then(res => res.data);
}

export default compose(
  connect(state => state),
  withFetch(fetchStuff)
)(({userState, resolved, failed, data}) => (
  resolved ? (
    <Dashboard bucket={data}>
      <EventStreamDisplay bucket={data} />
    </Dashboard>
  ) : (
    <Row className='vert-center'>
      <Col xs={12} sm={4} smOffset={4}>
        loading...
      </Col>
    </Row>
  )
));
