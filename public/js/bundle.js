(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    this.centreY = (this.centreY - 1) * this.speed
  }
  else if(direction === "RIGHT") {
    this.centreX = (this.centreX + 1) * this.speed
  }
  else if(direction === "DOWN") {
    this.centreY = (this.centreY + 1) * this.speed
  }
  else if(direction === "LEFT") {
    this.centreX = (this.centreX - 1) * this.speed
  }
}

module.exports = Player
},{}]},{},[1]);
