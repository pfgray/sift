import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import createStore from './store';
import Intro from './intro/Intro';
import Dashboard from './dashboard/Dashboard';
import EventStream from './dashboard/events/EventStream';
import GridView from './dashboard/graphs/GridView';
import Admin from './admin/Admin';
import Login from './login/Login';
import Signup from './login/Signup';
import Overview from './overview/Overview';
import initUserRoute from './initUserRoute.js';
import BucketForm from './user/BucketForm.js';
import Bucket from './user/Bucket.js';

//import '../../styles/normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../../styles/main.less';

const store = createStore(browserHistory);

// fetch the current user, if none, then redirect to login

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route name='intro' path='/' component={Intro}></Route>
      <Route name='login' path='/login' component={Login}></Route>
      <Route name='login' path='/signup' component={Signup}></Route>
      {/* <Route name='admin' path='/admin' component={Admin}></Route> */}
      {/* <Route name='dashboard' path='/dashboard' component={Dashboard}>
        <IndexRoute name='eventstream' component={EventStream}></IndexRoute>
        <Route name='graphs' path='/dashboard/graphs' component={GridView}></Route>
      </Route> */}
      <Route name='overview' path='/overview' component={Overview} onEnter={initUserRoute(store)} />
      <Route name='newBucket' path='/bucket/new' component={BucketForm} onEnter={initUserRoute(store)} />
      <Route name='bucket' path='/bucket/:id' component={Bucket} onEnter={initUserRoute(store)} />
    </Router>
  </Provider>,
  document.getElementById('content')
);
