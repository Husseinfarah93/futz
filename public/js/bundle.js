(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* JSONfn - javascript (both node.js and browser) plugin to stringify,
*          parse and clone objects with Functions, Regexp and Date.
*
* Version - 1.1.0
* Copyright (c) Vadim Kiryukhin
* vkiryukhin @ gmail.com
* http://www.eslinstructor.net/jsonfn/
*
* Licensed under the MIT license ( http://www.opensource.org/licenses/mit-license.php )
*
*   USAGE:
*     browser:
*         JSONfn.stringify(obj);
*         JSONfn.parse(str[, date2obj]);
*         JSONfn.clone(obj[, date2obj]);
*
*     nodejs:
*       var JSONfn = require('path/to/json-fn');
*       JSONfn.stringify(obj);
*       JSONfn.parse(str[, date2obj]);
*       JSONfn.clone(obj[, date2obj]);
*
*
*     @obj      -  Object;
*     @str      -  String, which is returned by JSONfn.stringify() function;
*     @date2obj - Boolean (optional); if true, date string in ISO8061 format
*                 is converted into a Date object; otherwise, it is left as a String.
*/

(function (exports) {
"use strict";

  exports.stringify = function (obj) {

    return JSON.stringify(obj, function (key, value) {
      var fnBody;
      if (value instanceof Function || typeof value == 'function') {


        fnBody = value.toString();

        if (fnBody.length < 8 || fnBody.substring(0, 8) !== 'function') { //this is ES6 Arrow Function
          return '_NuFrRa_' + fnBody;
        }
        return fnBody;
      }
      if (value instanceof RegExp) {
        return '_PxEgEr_' + value;
      }
      return value;
    });
  };

  exports.parse = function (str, date2obj) {

    var iso8061 = date2obj ? /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/ : false;

    return JSON.parse(str, function (key, value) {
      var prefix;

      if (typeof value != 'string') {
        return value;
      }
      if (value.length < 8) {
        return value;
      }

      prefix = value.substring(0, 8);

      if (iso8061 && value.match(iso8061)) {
        return new Date(value);
      }
      if (prefix === 'function') {
        return eval('(' + value + ')');
      }
      if (prefix === '_PxEgEr_') {
        return eval(value.slice(8));
      }
      if (prefix === '_NuFrRa_') {
        return eval(value.slice(8));
      }

      return value;
    });
  };

  exports.clone = function (obj, date2obj) {
    return exports.parse(exports.stringify(obj), date2obj);
  };

}(typeof exports === 'undefined' ? (window.JSONfn = {}) : exports));



},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
// Imports  
let socket = io()
let frontEndGame = require('./FrontEndGame.js')
let gameState;
let json = require('json-fn')
let previousBackEndUpdate;
let settings = document.getElementById('settingsButton')
let gameMode = document.getElementById('gameMode')
let play = document.getElementById('playButton')
let shouldDisplaySettings = false
let shouldDisplayGameMode = false




// Socket Events 
// Set up initial game state for each client
socket.on('initialiseGameState', gameStateComponents => {
  console.log("initialising: ", socket.id)
  if(!gameState) {
    gameStateComponents = json.parse(gameStateComponents)
    gameState = new frontEndGame(350, 500, gameStateComponents.player)
    gameState.components = gameStateComponents.components
    gameState.socket = socket
    gameState.player = gameStateComponents.player
    gameState.initialise()
    loops()
  }
})

socket.on('updateFrontEnd', gameStateComponents => {
  // console.log('updating front end: ', socket.id) 
  gameStateComponents = json.parse(gameStateComponents) 
  // console.log(gameStateComponents.velocity)
  gameState.components = gameStateComponents.components 
  gameState.player = gameStateComponents.player
})

socket.on('goal', res => {
  let node = res.team === 'left' ? document.getElementById('leftScore') : document.getElementById('rightScore')
  node.innerHTML = parseInt(node.innerHTML) + 1
})


function loops() {
  window.requestAnimationFrame(gameState.gameLoopFrontEnd)
  backEndLoop = setInterval(gameState.updateBackEnd, 1000 / 60)
}




settings.addEventListener('click', () => {
  	let elem = document.getElementById('settingsText')	
    if(shouldDisplaySettings) {
			elem.style.display = 'none'
    }
    else {
    	elem.style.display = 'block'
    }
    shouldDisplaySettings = !shouldDisplaySettings
})

gameMode.addEventListener('click', () => {
  	let elem = document.getElementById('gameModeText')	
    if(shouldDisplayGameMode) {
			elem.style.display = 'none'
    }
    else {
    	elem.style.display = 'block'
    }
    shouldDisplayGameMode = !shouldDisplayGameMode
})

play.addEventListener('click', () => {
	let modal = document.getElementById('modal')
  modal.style.display = 'none'
  socket.emit('initialiseGame')
})









},{"./FrontEndGame.js":2,"json-fn":1}]},{},[3]);
