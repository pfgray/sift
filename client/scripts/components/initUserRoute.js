import axios from 'axios';
import { browserHistory } from 'react-router';

export default function initUserRoute(store) {
  return function() {
    const {userState} = store.getState();
    if(!userState.loading && !userState.user){
      store.dispatch({ type: 'FETCH_USER' });
      axios.get('/api/me')
        .then(res => res.data)
        .then(user => {
          store.dispatch({
            type: 'RECEIVE_USER',
            payload: user
          });
        }).catch(err => {
          browserHistory.push( '/login')
        });
    }
  }
}
