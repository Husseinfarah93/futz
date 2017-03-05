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

Game.prototype.update = function() {
  this.clear()
  this.draw()
}

Game.prototype.bindMethods = function() {
  this.update = this.update.bind(this)
  this.draw = this.draw.bind(this)
  this.clear = this.clear.bind(this)
}


/*  Main METHOD SHIT */
let game = new Game(300, 300, 30)
game.bindMethods()
game.mountDOM()
let player = new Player(70, 70, 50, 1, 1, 'blue')
game.components.push(player)
window.addEventListener('keydown', (e) => {
  let code = e.keyCode
  if(code === 37) player.move("LEFT")
  else if(code === 38) player.move("UP")
  else if(code === 39) player.move("RIGHT")
  else if(code === 40) player.move("DOWN")
})
window.addEventListener('click', game.update)
setInterval(game.update, 1000 / game.framerate)