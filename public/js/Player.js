function Player(centreX, centreY, radius, weight, speed, team, ctx) {
  this.centreX = centreX
  this.centreY = centreY
  this.radius = radius 
  this.weight = weight 
  this.speed = speed 
  this.team = team
  this.ctx = ctx
}

Player.prototype.clear = function() {
  this.ctx.clearRect(this.centreX - this.radius, this.centreY - this.radius, this.radius * 2, this.radius * 2)
}

Player.prototype.draw = function(ctx) {
  ctx.fillStyle = 'green'
  ctx.beginPath() 
  ctx.arc(this.centreX, this.centreY, this.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
}

Player.prototype.move = function(direction) {
  if(direction === "UP") {
    this.centreY = this.centreY - this.radius > 0 ? (this.centreY - 5) * this.speed : this.centreY
  }
  else if(direction === "RIGHT") {
    this.centreX = this.centreX + this.radius < this.ctx.canvas.width ? (this.centreX + 5) * this.speed : this.centreX
  }
  else if(direction === "DOWN") {
    this.centreY = this.centreY + this.radius < this.ctx.canvas.height ? (this.centreY + 5) * this.speed : this.centreY
  }
  else if(direction === "LEFT") {
    this.centreX = this.centreX - this.radius > 0 ? (this.centreX - 5) * this.speed : this.centreX
  }
}

module.exports = Player