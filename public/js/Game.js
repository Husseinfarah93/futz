// watchify /Users/Hussein/Desktop/testProjects/futz/public/js/Game.js -o /Users/Hussein/Desktop/testProjects/futz/public/js/bundle.js 
let Player = require('./Player')

function Game(viewportHeight, viewportWidth, framerate) {
    this.components = []
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'viewport'
    this.ctx = this.canvas.getContext('2d')
    this.canvas.height = viewportHeight
    this.canvas.width = viewportWidth
    this.framerate = framerate
    this.keysDown = {
      "37": {val: false, direction: "LEFT"}, 
      "38": {val: false, direction: "UP"},
      "39": {val: false, direction: "RIGHT"}, 
      "40": {val: false, direction: "DOWN"}
    }
}

Game.prototype.mountDOM = function() {
  let body = document.getElementsByTagName('body')[0]
  body.appendChild(this.canvas)
}

// Check what is more efficient clearing the whole canvas or the individual pieces
Game.prototype.clear = function() {
  let list = this.components 
  this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width)
  // for(let i = 0; i < list.length; i++) {
  //   let component = list[i]
  //   component.clear(this.ctx)
  // }
}

Game.prototype.draw = function() {
  let list = this.components 
  for(let i = 0; i < list.length; i++) {
    let component = list[i]
    component.draw(this.ctx)
  }
}

Game.prototype.update = function(player) {
  this.keyPressed(player)
  this.clear()
  this.draw()
}

Game.prototype.bindMethods = function() {
  this.update = this.update.bind(this)
  this.draw = this.draw.bind(this)
  this.clear = this.clear.bind(this)
  this.mountDom = this.mountDOM.bind(this)
  this.keyPressed = this.keyPressed.bind(this)
}

Game.prototype.keyPressed = function(player) {
  let keys = Object.keys(this.keysDown)
  for(let i = 0; i < keys.length; i++) {
    if(this.keysDown[keys[i]].val === true) player.move(this.keysDown[keys[i]].direction)
  }
}

/*  Main METHOD SHIT */
let game = new Game(500, 500, 30)
game.bindMethods()
game.mountDOM()

let player = new Player(70, 70, 30, 1, 1, 'blue')
game.components.push(player)

window.addEventListener('keydown', (e) => {
  let code = e.keyCode
  if(game.keysDown[code] !== undefined) {
    game.keysDown[code].val = true 
  }
})

window.addEventListener('keyup', (e) => {
  let code = e.keyCode
  if(game.keysDown[code] !== undefined) {
      game.keysDown[code].val = false
  }
})

setInterval(() => game.update(player), 1000 / game.framerate)