import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup } from 'react-bootstrap';
import { compose, withState, withProps } from 'recompose';
import classNames from 'classnames';
import axios from 'axios';
import withFetch from '../util/withFetch';

export default compose(
  connect(state => state),
  withFetch(({params}) => axios.get(`/api/buckets/${params.id}`, {withCredentials:true}).then(res => res.data))
)(({userState, resolved, failed, data}) => (
  <Row className='vert-center'>
    <Col xs={12} sm={4} smOffset={4}>
      {resolved ? (
        <div>
          this is the single bucket!
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : 'loading...'}
    </Col>
  </Row>
));
