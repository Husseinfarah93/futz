function Player(centreX, centreY, radius, weight, speed, team, game) {
  this.centreX = centreX
  this.centreY = centreY
  this.radius = radius 
  this.weight = weight 
  this.speed = speed 
  this.team = team
  this.game = game
  this.ctx = game.ctx
  this.game.components.push(this)
  this.matterObj = this.game.Matter.Bodies.circle(this.centreX, this.centreY, this.radius)
  this.game.Matter.World.add(this.game.engine.world, this.matterObj)
}


Player.prototype.update = function() {
  this.game.Matter.Engine.update(this.game.engine, 1000 / this.game.framerate)
}

Player.prototype.draw = function(ctx) {
  ctx.fillStyle = this.team
  ctx.beginPath() 
  ctx.arc(this.matterObj.position.x , this.matterObj.position.y, this.matterObj.circleRadius, 0, 2 * Math.PI, false)
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
