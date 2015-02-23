'use strict';

var React = require('react/addons');

var model = [];
var ballCount = 50;
var ballColors = [
    'rgba(123,231,143, 0.75)',
    'rgba(234,125,14,  0.75)',
    'rgba(135,31,53,   0.75)',
    'rgba(134,67,43,   0.75)',
]

var PartyGraph = React.createClass({
  componentDidMount:function(){
    var canvas = this.getDOMNode();
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    var ctx = canvas.getContext('2d');
    for(var i=0; i<ballCount; i++){
      model.push({
        color:ballColors[i%ballColors.length],
        x:0,
        y:0
      });
    }
    function draw(){
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        model.forEach(function(ball){
            ball.x = Math.floor(Math.random() * canvas.width);
            ball.y = Math.floor(Math.random() * canvas.height);
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, 10, 0, 2 * Math.PI, false);
            ctx.fillStyle = ball.color;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }
    draw();
  },
  componentWillUnmount: function(){
    model = [];
  },
  render: function() {
    return (
      <canvas className='fill' />
    );
  }
});

module.exports = PartyGraph;
