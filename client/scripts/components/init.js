import { browserHistory } from 'react-router';
import { push } from 'react-router-redux';
import { fetchUser } from './user/userReducer';

export default function init(store) {
  store.dispatch(fetchUser());
}
