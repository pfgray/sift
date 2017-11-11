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
  connect(state => state, d => ({dispatch: d})),
  withFetch(() => axios.get('/api/buckets', {withCredentials:true}).then(res => res.data)),
  withProps(props => ({
    deleteBucket: (bucketId) => {
      axios.delete(`/api/buckets/${bucketId}`, {withCredentials:true})
        .then(res => {
          //res.data
          props.refetch();
        });
    }
  }))
)(({resolved, failed, data, userState, deleteBucket}) => (
  <Row className='vert-center'>
    <Col xs={12} sm={6} smOffset={3}>
      {(resolved && !userState.loading) ? (
        <div>
          {data.data.map(bucket => (
            <Row key={bucket.id} style={{display:'flex', alignItems: 'center', marginBottom: '1em'}}>
              <Col xs={11} >
                <Link to={`/bucket/${bucket.id}`} className='btn btn-info btn-block btn-lg' style={{marginBottom:'0'}}><i className='fa fa-shopping-basket'/>{bucket.name}</Link>
              </Col>
              <Col xs={1} style={{textAlign: 'center', fontSize: '2.5em'}}>
                <i className='fa fa-times text-danger' onClick={() => deleteBucket(bucket.id)} style={{cursor:'pointer'}} />
              </Col>
            </Row>
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
