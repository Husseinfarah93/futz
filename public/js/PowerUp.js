function PowerUp() {
  this.x = x
  this.y = y 
  this.radius = radius 
  this.active = true
  this.currentPower = currentPower
  this.powerImage = null
}


PowerUp.prototype.addPlayer = function(player) {
  this.player = player
}


PowerUp.prototype.activePowerUp = function() {
  if(this.currentPower === '') {

  }
  
}

PowerUp.prototype.draw = function(ctx) {
  ctx.fillStyle = this.team
  // fillStyle should be powerImage
  ctx.beginPath() 
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
}


module.exports = PowerUp


/*
Slime Soccer 
Hook/Rope to connect to yourself 
Magnet 
Stop Ball  /  Freeze Ball
Super Speed Player 
Time Stop 
Black Hole 
Explosion 
Attraction 

Rocket League 
Spikes 
Larger
Tornado
The Boot



*/