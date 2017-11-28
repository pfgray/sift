import axios from 'axios';
import { push } from 'react-router-redux';

const initialState = {
  loading: true,
  user: null
};

export function receiveUser(user) {
  return dispatch => {
    dispatch({
      type: 'RECEIVE_USER',
      payload: user
    });
    if(user.role === "admin") {
      dispatch(push('/admin'));
    } else {
      dispatch(push('/overview'));
    }
  }
}

export function fetchUser() {
  return dispatch => {
    dispatch({ type: 'FETCH_USER' });
    axios.get('/api/me', {withCredentials:true})
      .then(res => res.data)
      .then(user => {
        dispatch(receiveUser(user));
      })
      .catch(err => {
        dispatch(push( '/login'));
      });
  }
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_USER':
      return { loading: true };
    case 'RECEIVE_USER':
      return { loading: false, user: action.payload };
    default:
      return state;
  }
}
