var React = require('react'),
    { Route, DefaultRoute } = require('react-router'),
    App = require('./App'),
    Intro = require('./intro/Intro'),
    Dashboard = require('./dashboard/Dashboard'),
    EventStream = require('./dashboard/events/EventStream');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;

var content = document.getElementById('content');

var routes = (
  <Route handler={App}>
    <Route name='intro' path='/' handler={Intro}></Route>
    <Route name='dashboard' path='/dashboard' handler={Dashboard}>
      <DefaultRoute name='eventstream' handler={EventStream}></DefaultRoute>
    </Route>
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Handler) {
  React.render(<Handler/>, content);
});
