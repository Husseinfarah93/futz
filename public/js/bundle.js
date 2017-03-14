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
    // console.log("player component: ", component)
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

FrontEndGame.prototype.initialise = function() {
  this.mountDOM() 
}

module.exports = FrontEndGame
},{}],3:[function(require,module,exports){
// Imports 
let socket = io()
let framerate = 30
let frontEndGame = require('./FrontEndGame.js')
let gameState;
let json = require('json-fn')
let clearButton = document.createElement('button')
clearButton.innerHTML = 'clear'
document.body.appendChild(clearButton)




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
    gameState.draw()
  }
})








// let timeoutFunction = setTimeout(frontEndGameState.updateBackEnd, 1000 / framerate)

clearButton.addEventListener('click', () => {
  clearInterval(timeoutFunction)
})








},{"./FrontEndGame.js":2,"json-fn":1}]},{},[3]);
