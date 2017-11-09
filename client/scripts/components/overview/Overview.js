import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup } from 'react-bootstrap';
import { compose, withState, withProps } from 'recompose';
import classNames from 'classnames';
import axios from 'axios';
import withFetch from '../util/withFetch';

const Login = compose(
  connect(state => state),
  withFetch(() => axios.get('/api/buckets', {withCredentials:true}).then(res => res.data))
)(({resolved, failed, data, userState}) => (
  <Row className='vert-center'>
    <Col xs={12} sm={4} smOffset={4}>
      {(resolved && !userState.loading) ? (
        <div>
          <h3>{userState.user.username}'s buckets</h3>
          {data.data.map(bucket => (
            <div key={bucket.id}>
              <Link to={`/bucket/${bucket.id}`} className='btn btn-info btn-block btn-lg'><i className='fa fa-shopping-basket'/>{bucket.name}</Link>
            </div>
          ))}
          <div>
            <Link to='/bucket/new' className="branded-login">Create new</Link>
          </div>
        </div>
      ): <div>loading...</div>}
    </Col>
  </Row>
));

export default Login;
