function Player(centreX, centreY, radius, weight, speed, team) {
  this.centreX = centreX
  this.centreY = centreY
  this.radius = radius 
  this.weight = weight 
  this.speed = speed 
  this.team = team
}

Player.prototype.clear = function(ctx) {
  ctx.clearRect(this.centreX - this.radius, this.centreY - this.radius, this.radius * 2, this.radius * 2)
}

Player.prototype.draw = function(ctx) {
  ctx.fillStyle = 'green'
  ctx.beginPath() 
  ctx.arc(this.centreX, this.centreY, this.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
}

Player.prototype.move = function(direction) {
  if(direction === "UP") {
    this.centreY = (this.centreY - 10) * this.speed
  }
  else if(direction === "RIGHT") {
    this.centreX = (this.centreX + 10) * this.speed
  }
  else if(direction === "DOWN") {
    this.centreY = (this.centreY + 10) * this.speed
  }
  else if(direction === "LEFT") {
    this.centreX = (this.centreX - 10) * this.speed
  }
}

module.exports = Player