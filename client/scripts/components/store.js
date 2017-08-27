import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import {routerMiddleware, routerReducer} from 'react-router-redux';

import userReducer from './user/userReducer.js';

const composeEnhanced = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function(history) {
  const reducers = combineReducers({
    userState: userReducer
  });

  return createStore(
    reducers,
    composeEnhanced(applyMiddleware(createLogger({
      collapsed: () => true
    }), thunk, routerMiddleware(history)))
  );
}
