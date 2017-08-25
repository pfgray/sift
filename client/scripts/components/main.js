import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { render } from 'react-dom';

import Intro from './intro/Intro';
import Dashboard from './dashboard/Dashboard';
import EventStream from './dashboard/events/EventStream';
import GridView from './dashboard/graphs/GridView';
import Admin from './admin/Admin';
import Login from './login/Login';
import Signup from './login/Signup';

import '../../styles/normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../../styles/main.css';

render(
  <Router history={browserHistory}>
    <Route name='intro' path='/' component={Intro}></Route>
    <Route name='login' path='/login' component={Login}></Route>
    <Route name='login' path='/signup' component={Signup}></Route>
    <Route name='admin' path='/admin' component={Admin}></Route>
    <Route name='dashboard' path='/dashboard' component={Dashboard}>
      <IndexRoute name='eventstream' component={EventStream}></IndexRoute>
      <Route name='graphs' path='/dashboard/graphs' component={GridView}></Route>
    </Route>
  </Router>,
  document.getElementById('content')
);
