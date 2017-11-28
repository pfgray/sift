import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup } from 'react-bootstrap';
import { compose, withState, withProps } from 'recompose';
import classNames from 'classnames';
import axios from 'axios';
import Brand from '../intro/Brand';
import { receiveUser } from '../user/userReducer';

const Login =
  compose(
    withState('username', 'setUsername'),
    withState('password', 'setPassword'),
    withState('loggingIn', 'setLoggingIn'),
    withState('errorCount', 'setErrorCount', 0),
    connect(() => ({}), dispatch => ({dispatch})),
    withProps(props => ({
      up: updater => ev => {
        props.setErrorCount(0);
        updater(ev.target.value)
      },
      login: event => {
        event.preventDefault();
        props.setLoggingIn(true)
        axios.post('/api/login', {
          username: props.username,
          password: props.password
        }).then(resp => {
          props.dispatch(receiveUser(resp.data));
        }).catch(err => {
          props.setErrorCount(props.errorCount + 1);
          props.setLoggingIn(false);
        })
      }
    }))
  )(({username, setUsername, password, setPassword, loggingIn, up, login, errorCount}) => (
    <Brand>
      <form onSubmit={login}>
        <FormGroup>
          <FormControl type='input'    value={username} name='username' placeholder='username' onChange={up(setUsername)}/>
          <FormControl type='password' value={password} name='password' placeholder='password' onChange={up(setPassword)}/>
          <div className={classNames('submit-wrapper', {'hasError': errorCount > 0})}>
            <Button block bsStyle="info" className="branded-login" disabled={loggingIn} type="submit">Log In</Button>
            {errorCount > 0 ? <span><i className='fa fa-warning'/>{errorCount}</span>: null}
          </div>
        </FormGroup>
      </form>
      <div className='subtext'>Don't have a login? <Link to='/signup'>Sign up</Link></div>
    </Brand>
  ));

export default Login;
