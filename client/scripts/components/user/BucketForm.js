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
  withState('name', 'setName', ''),
  withState('creating', 'setCreating', false),
  withProps(props => ({
    up: updater => ev => updater(ev.target.value),
    create: (event) => {
      props.setCreating(true)
      axios.post('/api/buckets', {
        name: props.name,
      }, {withCredentials:true}).then(resp => {
        // redirect to /bucket/:id?
        window.location = '/bucket/' + resp.data.id;
      }).catch(err => {
        props.setCreating(false);
      });
      return event.preventDefault();
    }
  }))
)(({name, userState, creating, create, up, setName}) => (
  <Row className='vert-center'>
    <Col xs={12} sm={4} smOffset={4}>
      <form onSubmit={create}>
        <FormGroup>
          <FormControl type='input' value={name} name='name' placeholder='name' onChange={up(setName)}/>
          <Button block bsStyle="success" className="branded-login" disabled={creating} type='submit'>Create</Button>
        </FormGroup>
      </form>
    </Col>
  </Row>
));

export default Login;
