function Pitch(xOrigin, yOrigin, pitchHeight, pitchWidth, game) {
  this.x = xOrigin 
  this.y = yOrigin
  this.height = pitchHeight 
  this.width = pitchWidth 
  this.game = game 
  this.ctx = this.game.ctx
  this.game.components.push(this)
}


Pitch.prototype.draw = function() {
  let ctx = this.ctx 
  ctx.fillStyle = '#45BF55'
  ctx.fillRect(this.x, this.y, this.width, this.height)
}

Pitch.prototype.clear = function() {
  let ctx = this.ctx 
  ctx.clearRect(this.x, this.y, this.width, this.height)
}

module.exports = Pitch