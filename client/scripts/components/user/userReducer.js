
const initialState = {
  loading: false,
  user: null
};

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
