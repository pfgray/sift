import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup, Modal } from 'react-bootstrap';
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
  })),
  withState('confirmDeleteBucket', 'setConfirmDeleteBucket', null)
)(({resolved, failed, data, userState, deleteBucket, confirmDeleteBucket, setConfirmDeleteBucket}) => (
  <div className='page'>
    <Grid>
      <Row>
        <Col xs={12} md={6} mdOffset={3}>
          {(resolved && !userState.loading) ? (
            <ul className="list-group">
              {data.data.map(bucket => (
                <li className="list-group-item" key={bucket.id}>
                  <Link to={`/bucket/${bucket.id}`} className='' style={{marginBottom:'0'}}>{bucket.name}</Link>

                  <span className='list-item-opts'>
                    <span className='delete text-danger'><i className='fa fa-trash'  onClick={() => setConfirmDeleteBucket(bucket)}/></span>
                  </span>
                </li>
              ))}
              <div>
                <Link to='/bucket/new' className="btn btn-success" style={{marginTop: '1rem'}}>Create new</Link>
              </div>
            </ul>
          ): <div>loading...</div>}
        </Col>
        {confirmDeleteBucket ? (<ConfirmDelete bucket={confirmDeleteBucket} del={deleteBucket} close={() => setConfirmDeleteBucket(null)}/>) : null}
      </Row>
    </Grid>
  </div>
));

const ConfirmDelete = ({bucket, del, close}) => (
  <Modal show={true} onHide={close}>
    <Modal.Body>
      <p style={{color: '#777', fontSize: '1.5em', textAlign: 'center'}}>Are you sure you want to delete {bucket.name}?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={close} bsStyle="link">Close</Button>
      <Button onClick={() => {del(bucket.id); close();}} bsStyle="danger">Delete</Button>
    </Modal.Footer>
  </Modal>
);

export default Login;
