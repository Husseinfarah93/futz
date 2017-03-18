function Ball(centreX, centreY, radius, colour) {
  this.centreX = centreX
  this.centreY = centreY
  this.radius = radius 
  this.colour = colour
}

Ball.prototype.update = function() {
  
}

Ball.prototype.draw = function(ctx) {
  ctx.fillStyle = this.colour
  ctx.beginPath() 
  ctx.arc(this.centreX, this.centreY, this.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
}


module.exports = Ball