function FrontEndGame(viewportHeight, viewportWidth, player) {
  this.components = []
  this.canvas = document.createElement('canvas')
  this.canvas.id = 'viewport'
  this.ctx = this.canvas.getContext('2d')
  this.canvas.height = viewportHeight
  this.canvas.width = viewportWidth
  this.player = player
  this.keysDown = {
    "37": {val: false, direction: "LEFT"}, 
    "38": {val: false, direction: "UP"},
    "39": {val: false, direction: "RIGHT"}, 
    "40": {val: false, direction: "DOWN"}
  }
}

FrontEndGame.prototype.mountDOM = function() {
  let body = document.getElementsByTagName('body')[0]
  body.appendChild(this.canvas)
}

FrontEndGame.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

FrontEndGame.prototype.draw = function() {
  let ctx = this.ctx 
  // Draw Components 
  // Draw Pitch 
  let pitchKeys = Object.keys(this.components.pitch) 
  for(let i = 0; i < pitchKeys.length; i++) {
    let component = this.components.players[pitchKeys[i]]
    console.log('Pitch Component: ', component) 
    component.draw(ctx)
  }
  // Draw Players  
  let playersComponentsKeys = Object.keys(this.components.players) 
  for(let i = 0; i < playersComponentsKeys.length; i++) {
    let component = this.components.players[playersComponentsKeys[i]] 
    console.log("player component: ", component)
    component.draw(ctx)
  }
  // Draw Balls 
  let ballComponentKeys = Object.keys(this.components.balls) 
  for(let i = 0; i < ballComponentKeys.length; i++) {
    let component = this.components.balls[ballComponentKeys[i]]
    console.log('Ball Component: ', component) 
    component.draw(ctx)
  }
}

FrontEndGame.prototype.addEventListeners = function() {
  window.addEventListener('keydown', e => {
    // Update the locl state for positions to be updated
    let code = e.keyCode
    if(code === 37 || code === 38 || code === 39 || code === 40) {
      this.keyDown[code] = true
    }
  })

  window.addEventListener('keyup', e => {
    // Update the locl state for positions to be updated
    let code = e.keyCode
    if(code === 37 || code === 38 || code === 39 || code === 40) {
      this.keyDown[code] = false
    }
  })
}

FrontEndGame.prototype.updateBackEnd = function() {
  if(this.socket) {
    this.socket.emit('updatePlayerPosition', {
      id: this.socket.id,
      player: this.player
    })
  }
}

FrontEndGame.prototype.updateLocalPosition = function() {
  let keys = Object.keys(this.keysDown) 
  for(let i = 0; i < keys.length; i++) {
    let obj = this.keysDown[keys[i]] 
    if(obj.val) {
      if(obj.direction === "LEFT") {

      }
      else if(obj.direction === "UP") {

      }
      else if(obj.direction === "RIGHT") {

      }
      elseif(obj.direction === "DOWN")
    }

  }
}

FrontEndGame.prototype.getCorrectPlayer = function() {
  return this.components.players.socket.id
}

module.exports = FrontEndGame