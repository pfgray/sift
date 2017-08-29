import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup } from 'react-bootstrap';
import { compose, withState, withProps } from 'recompose';
import classNames from 'classnames';
import axios from 'axios';

const Signup =
  compose(
    withState('username', 'setUsername'),
    withState('password', 'setPassword'),
    withState('loggingIn', 'setLoggingIn'),
    withState('errorCount', 'setErrorCount', 0),
    withProps(props => ({
      up: updater => ev => {
        props.setErrorCount(0);
        updater(ev.target.value)
      },
      login: event => {
        event.preventDefault();
        props.setLoggingIn(true);
        axios.post('/api/signup', {
          username: props.username,
          password: props.password
        }).then(resp => {
          console.log('got response: ', resp);
          // redirect to /dashboard?
          window.location = '/overview';
        }).catch(err => {
          props.setErrorCount(props.errorCount + 1);
          props.setLoggingIn(false);
        })
      }
    }))
  )(({username, setUsername, password, setPassword, loggingIn, up, login, errorCount}) => (
      <Row className='vert-center'>
        <Col xs={12} sm={4} smOffset={4}>
          <form onSubmit={login}>
            <FormGroup>
              <FormControl type='input'    value={username} name='username' placeholder='username' onChange={up(setUsername)}/>
              <FormControl type='password' value={password} name='password' placeholder='password' onChange={up(setPassword)}/>
              <div className={classNames('submit-wrapper', {'hasError': errorCount > 0})}>
                <Button block bsStyle="warning" className="branded-login" disabled={loggingIn} type="submit">Sign Up</Button>
                {errorCount > 0 ? <span><i className='fa fa-warning'/>{errorCount}</span>: null}
              </div>
            </FormGroup>
          </form>
        </Col>
      </Row>
  ));

export default Signup;
