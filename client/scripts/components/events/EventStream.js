'use strict';

var React = require('react/addons');
var Event = require('./Event.js');

var EventStream = React.createClass({
  getInitialState: function() {
    return {events: [{
      message:"Event 1"
    },{
      message:"Event 2"
    },{
      message:"Event 3"
    }]};
  },
  componentDidMount: function() {
    setInterval(function(){
      var eventCount = this.state.events.length;
      this.state.events.push({
        message:"This is a new event! #" + (eventCount + 1)
      });
      this.setState({events:this.state.events})
    }.bind(this), 1000);
  },
  render: function() {
    var events = this.state.events.map(function(event){
      return (<Event message={event.message} />);
    });
    return (
      <div className='menu'>
        {events}
      </div>
    );
  }
});

module.exports = EventStream;
