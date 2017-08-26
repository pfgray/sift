import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup } from 'react-bootstrap';
import { compose, withState, withProps } from 'recompose';
import classNames from 'classnames';
import axios from 'axios';
import withFetch from '../util/withFetch';

const Login = compose(
  withFetch(() => axios.get('/api/buckets', {withCredentials:true}).then(res => res.data))
)(({resolved, failed, data}) => (
  <Row className='vert-center'>
    <Col xs={12} sm={4} smOffset={4}>
      <h3>Buckets</h3>
      {resolved ? (
        data.data.map(bucket => (
          <Link to={`/bucket/${bucket.id}`} className='btn btn-primary'>{bucket.name}</Link>
        ))
      ): <div>loading...</div>}
    </Col>
  </Row>
));

export default Login;
