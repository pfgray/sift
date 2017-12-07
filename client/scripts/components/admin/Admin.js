import React from 'react';
import { compose, withState, withProps } from 'recompose';
import withFetch from '../util/withFetch';
import axios from 'axios';
import { Col, Row, Grid, ButtonGroup, Button, FormControl, FormGroup, Modal, ControlLabel } from 'react-bootstrap';

const Admin = compose(
  withFetch(() => axios.get('/api/users', {withCredentials:true}).then(res => res.data.data)),
  withProps(props => ({
    deleteUser: (userId) => {
      axios.delete(`/api/users/${userId}`, {withCredentials:true})
        .then(res => {
          //res.data
          props.refetch();
        });
    },
    updatePassword: (userId, password) => {
      console.log('updating password:', userId, password);
      axios.put(`/api/users/${userId}/password`, {password}, {withCredentials:true})
        .then(res => {
          //res.data
          props.refetch();
        });
    }
  })),
  withState('confirmDeleteUser', 'setConfirmDeleteUser', null),
  withState('changingPassword', 'setChangingPassword', null)
)(({resolved, data, confirmDeleteUser, setConfirmDeleteUser, deleteUser, updatePassword, changingPassword, setChangingPassword}) => (
  <div className="page">
    <Grid>
      <Row>
        <Col md={6} mdOffset={3}>
        {resolved ? (
          <ul className="list-group">
            {data.map(u => (
              <li className="list-group-item user" key={u.id}>
                <span className='username'>{u.username}</span>
                <span className={'role ' + u.role}>{u.role}</span>
                {u.role === 'admin' ? null: (
                  <span className='list-item-opts'>
                    <span className='delete text-success'>
                      <i className='fa fa-key'  onClick={() => setChangingPassword(u)}/>
                    </span>
                    <span className='delete text-danger'>
                      <i className='fa fa-trash'  onClick={() => setConfirmDeleteUser(u)}/>
                    </span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        ): null}
        </Col>
      </Row>
      {confirmDeleteUser ? (<ConfirmDelete user={confirmDeleteUser}  del={deleteUser} close={() => setConfirmDeleteUser(null)}/>) : null}
      {changingPassword ? (<ChangePassword user={changingPassword} update={updatePassword} close={() => setChangingPassword(null)}/>) : null}
    </Grid>
  </div>
));

const ConfirmDelete = ({user, del, close}) => (
  <Modal show={true} onHide={close}>
    <Modal.Body className='small-body'>
      <p style={{color: '#777', fontSize: '1.5em', textAlign: 'center'}}>Are you sure you want to delete {user.username}?</p>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={close} bsStyle="link">Close</Button>
      <Button onClick={() => {del(user.id); close();}} bsStyle="danger">Delete</Button>
    </Modal.Footer>
  </Modal>
);

const ChangePassword = compose(
  withState('password', 'setPassword', null)
)(({user, update, close, password, setPassword}) => (
  <Modal show={true} onHide={close}>
    <Modal.Body className='small-body'>
      <form onSubmit={() => {update(user.id, password); close();}}>
        <FormGroup>
          <ControlLabel style={{color: '#777'}}>Enter new password for {user.username}:</ControlLabel>
          <FormControl type='password' value={password} name='password' placeholder='New password' onChange={e => setPassword(e.target.value)} style={{color: '#777'}}/>
        </FormGroup>
      </form>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={close} bsStyle="link">Close</Button>
      <Button onClick={() => {update(user.id, password); close();}} bsStyle="primary">Change</Button>
    </Modal.Footer>
  </Modal>
));

export default Admin;
