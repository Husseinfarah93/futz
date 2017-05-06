function FrontEndGame(viewportHeight, viewportWidth, player) {
  this.components = []
  this.canvas = document.createElement('canvas')
  this.canvas.id = 'viewport'
  this.ctx = this.canvas.getContext('2d')
  this.canvas.height = viewportHeight
  this.canvas.width = viewportWidth
  this.canvas.height = this.canvas.height * 1.2 
  this.canvas.width = this.canvas.width * 1.5
  this.player = player
  document.body.style.width = this.canvas.width + 'px'

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

FrontEndGame.prototype.bindMethods = function() {
  this.mountDOM = this.mountDOM.bind(this) 
  this.clear = this.clear.bind(this) 
  this.draw = this.draw.bind(this) 
  this.drawPitch = this.drawPitch.bind(this) 
  this.addEventListeners = this.addEventListeners.bind(this) 
  this.updateBackEnd = this.updateBackEnd.bind(this) 
  this.updateLocalPosition = this.updateLocalPosition.bind(this) 
  this.gameLoopFrontEnd = this.gameLoopFrontEnd.bind(this)
}

FrontEndGame.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
}

FrontEndGame.prototype.draw = function() {
  let ctx = this.ctx 
  // Draw Components 
    // Draw Pitch 
    this.drawPitch()
    // Draw Goals
    let goalsComponentsKeys = Object.keys(this.components.goals)  
    for(let i = 0; i < goalsComponentsKeys.length; i++) {
      let component = this.components.goals[goalsComponentsKeys[i]] 
      component.draw(ctx)
    }
    // Draw Players  
    let playersComponentsKeys = Object.keys(this.components.players) 
    for(let i = 0; i < playersComponentsKeys.length; i++) {
      let component = this.components.players[playersComponentsKeys[i]] 
      // console.log("player component: ", component)
      component.draw(ctx)
    }
    // Draw Balls 
    let ballComponentKeys = Object.keys(this.components.balls) 
    for(let i = 0; i < ballComponentKeys.length; i++) {
      let component = this.components.balls[ballComponentKeys[i]]
      // console.log('Ball Component: ', component) 
      component.draw(ctx)
    }
}

FrontEndGame.prototype.drawPitch = function() {
  let ctx = this.ctx
  ctx.fillStyle = '#167F39'
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
}

FrontEndGame.prototype.addEventListeners = function() {
  let self = this
  window.addEventListener('keydown', e => {
    // Update the locl state for positions to be updated
    let code = e.keyCode
    if(code === 37 || code === 38 || code === 39 || code === 40) {
      self.keysDown[code].val = true
    }
  })

  window.addEventListener('keyup', e => {
    // Update the locl state for positions to be updated
    let code = e.keyCode
    if(code === 37 || code === 38 || code === 39 || code === 40) {
      self.keysDown[code].val = false
    }
  })
}

FrontEndGame.prototype.updateBackEnd = function() {
  // console.log("updating back end", this.player.newPosition)
  if(this.socket) {
    this.socket.emit('updatePlayerPosition', {
      id: this.socket.id,
      newPosition: this.player.newPosition
    })
  }
}

FrontEndGame.prototype.updateLocalPosition = function() {
  let keys = Object.keys(this.keysDown) 
  for(let i = 0; i < keys.length; i++) {
    let obj = this.keysDown[keys[i]] 
    if(obj.val) {
      if(obj.direction === "LEFT") {
        this.player.newPosition.x -= this.player.speed
      }
      else if(obj.direction === "UP") {
        this.player.newPosition.y -= this.player.speed
      }
      else if(obj.direction === "RIGHT") {
        this.player.newPosition.x += this.player.speed
      }
      else if(obj.direction === "DOWN") {
        this.player.newPosition.y += this.player.speed
      }
    }

  }
}

FrontEndGame.prototype.getCorrectPlayer = function() {
  return this.components.players.socket.id
}

FrontEndGame.prototype.initialise = function() {
  this.addEventListeners()
  this.mountDOM() 
  this.bindMethods()
}

FrontEndGame.prototype.gameLoopFrontEnd = function() {
  this.clear() 
  this.updateLocalPosition() 
  this.draw() 
  window.requestAnimationFrame(this.gameLoopFrontEnd)
}




module.exports = FrontEndGame