(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

Game.prototype.update = function() {
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

let player = new Player(70, 70, 50, 1, 1, 'blue')
game.components.push(player)

window.addEventListener('keydown', (e) => {
  let code = e.keyCode
  if(game.keysDown[code] !== undefined) {
    game.keysDown[code].val = true 
    game.keyPressed(player)
  }
})

window.addEventListener('keyup', (e) => {
  let code = e.keyCode
  if(game.keysDown[code] !== undefined) {
      game.keysDown[code].val = false
  }
})


window.addEventListener('click', game.update)
setInterval(game.update, 1000 / game.framerate)
},{"./Player":2}],2:[function(require,module,exports){
function Player(centreX, centreY, radius, weight, speed, team) {
  this.centreX = centreX
  this.centreY = centreY
  this.radius = radius 
  this.weight = weight 
  this.speed = speed 
  this.team = team
}

Player.prototype.clear = function(ctx) {
  ctx.clearRect(this.centreX - this.radius, this.centreY - this.radius, this.radius * 2, this.radius * 2)
}

Player.prototype.draw = function(ctx) {
  ctx.fillStyle = 'green'
  ctx.beginPath() 
  ctx.arc(this.centreX, this.centreY, this.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
}

Player.prototype.move = function(direction) {
  if(direction === "UP") {
    this.centreY = (this.centreY - 10) * this.speed
  }
  else if(direction === "RIGHT") {
    this.centreX = (this.centreX + 10) * this.speed
  }
  else if(direction === "DOWN") {
    this.centreY = (this.centreY + 10) * this.speed
  }
  else if(direction === "LEFT") {
    this.centreX = (this.centreX - 10) * this.speed
  }
}

module.exports = Player
},{}]},{},[1]);
