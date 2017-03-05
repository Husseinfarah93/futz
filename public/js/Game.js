// watchify /Users/Hussein/Desktop/testProjects/futz/public/js/Game.js -o /Users/Hussein/Desktop/testProjects/futz/public/js/bundle.js 
/* 
Checklist: 
- Architecture with Pitch, Background etc 
- Collision Detection
- Ball 
- Physics Engine
- Sockets + new players
*/


// IMPORTS 
let Goal;
let Pitch = require('./Pitch.js');
let Ball;
let Player = require('./Player.js')

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
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  this.drawBackground()
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

Game.prototype.drawBackground = function() {
  let x = 0
  let y = 0 
  let height = this.canvas.height
  let width = this.canvas.width
  this.ctx.fillStyle = '#167F39'
  this.ctx.fillRect(x, y, width, height)
}


// Setup Game
let game = new Game(400, 700, 30)
console.log(game)
game.bindMethods()
game.mountDOM()
game.drawBackground()

// Create Pitch 
// Pitch(xOrigin, yOrigin, pitchHeight, pitchWidth, game)
let pitch = new Pitch(0, 50, 300, 700, game)




// Create Players
// Player(centreX, centreY, radius, weight, speed, team, game
let player = new Player(70, 70, 15, 1, 1, 'white', game)




// Add event listeners
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