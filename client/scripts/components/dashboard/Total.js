'use strict';

var React = require('react/addons');

var Dashboard = React.createClass({
  componentWillReceiveProps: function(nextProps){
    console.log('Recieved new Props: ', nextProps, 'current props are:', this.props);
  },
  render: function() {
    var total;
    if(this.props.total || this.props.total === 0){
      total = (<div className="total">{this.props.total}</div>);
    } else {
      total = (<div className="total loading"><i className="fa fa-circle-o-notch fa-spin"></i></div>);
    }
    return (
      <div className={"total-block " + (this.props.className ? this.props.className : '')}>
        <div className="total-label">{this.props.label}</div>
        {total}
      </div>
    );
  }
});

module.exports = Dashboard;
