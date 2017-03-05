// watchify /Users/Hussein/Desktop/testProjects/futz/public/js/Game.js -o /Users/Hussein/Desktop/testProjects/futz/public/js/bundle.js 
let Player = require('./Player')

function Game(viewportHeight, viewportWidth) {
    this.components = []
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'viewport'
    this.ctx = this.canvas.getContext('2d')
    this.canvas.height = viewportHeight
    this.canvas.width = viewportWidth
}



Game.prototype.mountDOM = function() {
  let body = document.getElementsByTagName('body')[0]
  body.appendChild(this.canvas)
}

Game.prototype.clear = function() {
  let list = this.components 
  for(let i = 0; i < list.length; i++) {
    // clear rect
  }
}


let game = new Game(300, 300)
game.mountDOM()
let player = new Player(70, 70, 50, 1, 1, 'blue')
let isClicked = false
window.addEventListener('click', () => {
  if(isClicked) {
    player.clear(game.ctx)
    isClicked = false
  }
  else {
    player.move('RIGHT')
    player.draw(game.ctx)
    isClicked = true
  }
})