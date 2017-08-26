import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup } from 'react-bootstrap';
import { compose, withState, withProps } from 'recompose';
import classNames from 'classnames';
import axios from 'axios';

const Login =
  compose(
    withState('username', 'setUsername'),
    withState('password', 'setPassword'),
    withState('loggingIn', 'setLoggingIn'),
    withProps(props => ({
      up: updater => ev => updater(ev.target.value),
      login: () => {
        props.setLoggingIn(true)
        axios.post('/api/login', {
          username: props.username,
          password: props.password
        }).then(resp => {
          console.log('got response: ', resp);
          // redirect to /dashboard?
          window.location = '/overview';
        }).catch(err => {
          props.setLoggingIn(false);
        })
      }
    }))
  )(({username, setUsername, password, setPassword, loggingIn, up, login}) => (
      <Row className='vert-center'>
        <Col xs={12} sm={4} smOffset={4}>
          <FormGroup>
            <FormControl type='input'    value={username} name='username' placeholder='username' onChange={up(setUsername)}/>
            <FormControl type='password' value={password} name='password' placeholder='password' onChange={up(setPassword)}/>
            <Button block onClick={login} bsStyle="info" className="branded-login" disabled={loggingIn}>Log In</Button>
          </FormGroup>
          <div className='subtext'>Don't have a login? <Link to='/signup'>Sign up</Link></div>
        </Col>
      </Row>
  ));

export default Login;
