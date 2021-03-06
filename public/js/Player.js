function Player(centreX, centreY, radius, team, game, socketId) {
  this.centreX = centreX
  this.centreY = centreY
  this.radius = radius 
  this.team = team
  this.originalSpeed = 0.00125 
  this.speed = 0.00125
  this.isPressed = false
  this.newPosition = {
    x: 0, 
    y: 0
  }
}

Player.prototype.update = function() {
  // this.game.Matter.Engine.update(this.game.engine)
}

Player.prototype.draw = function(ctx) {
  ctx.fillStyle = this.team
  ctx.beginPath() 
  ctx.arc(this.centreX, this.centreY, this.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
}


module.exports = Player