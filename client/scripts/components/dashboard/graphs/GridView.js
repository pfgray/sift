'use strict';

var React = require('react/addons');
var EventBarGraph = require('./EventBarGraph.js');
var PartyGraph = require('./PartyGraph.js');

require('./grid.less');

var Grid = React.createClass({
  render: function() {
    return (
      <div className='grid'>
        <div className='halfGrid'>
          <EventBarGraph />
        </div>
        <div className='halfGrid'>
          <PartyGraph />
        </div>
      </div>
    );
  }
});

module.exports = Grid;
