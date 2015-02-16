'use strict';

var React = require('react/addons');

require('./grid.less');

var bars = [{
    color:'rgba(123,231,143, 0.75)',
    value:3,
}, {
    color:'rgba(234,125,14,  0.75)',
    value:6
}, {
    color:'rgba(135,31,53,   0.75)',
    value:9
}, {
    color:'rgba(134,67,43,   0.75)',
    value:5
}];

var bar_width = 50;

var EventBarGraph = React.createClass({
  componentDidMount:function(){
    var canvas = this.getDOMNode();
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    var ctx = canvas.getContext('2d');

    //grab the data from the server & add it to the model.

    function render(){
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        var x = 0;
        bars.forEach(function(bar){
          x += bar_width;
          ctx.fillStyle = bar.color;
          ctx.fillRect(x, canvas.height - bar.value*10, bar_width, canvas.height);
        });
        requestAnimationFrame(render);
    }
    render();
  },
  render: function() {
    return (
      <canvas className='fill' />
    );
  }
});

module.exports = EventBarGraph;
