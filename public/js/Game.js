// watchify /Users/Hussein/Desktop/testProjects/futz/public/js/Game.js -o /Users/Hussein/Desktop/testProjects/futz/public/js/bundle.js 
/* 
Checklist: 
- Architecture with Pitch, Background etc ✓
- Ball 
- Collision Detection
- Physics Engine
- Sockets + new players
*/


// IMPORTS 
let Goal;
let Ball;
let Pitch = require('./Pitch.js'),
    Player = require('./Player.js'),
    Matter = require('matter-js'),
    Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies, 
    Events = Matter.Events


var engine = Engine.create();
// // create a renderer
// var render = Render.create({
//     element: document.body,
//     engine: engine
// });
// // create two boxes and a ground
// var boxA = Bodies.rectangle(400, 200, 80, 80);
engine.world.gravity.y = 0
// // add all of the bodies to the world
// World.add(engine.world, [boxA]);
// // run the engine
// Engine.run(engine);
// // run the renderer
// Render.run(render);


  function Game(viewportHeight, viewportWidth, framerate, engine) {
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
      this.Matter = Matter
      this.engine = engine
  }

  Game.prototype.mountDOM = function() {
    let body = document.getElementsByTagName('body')[0]
    body.appendChild(this.canvas)
  }

  // Check what is more efficient clearing the whole canvas or the individual pieces
  Game.prototype.clear = function() {
    let list = this.components 
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  Game.prototype.draw = function() {
    let list = this.components 
    for(let i = 0; i < list.length; i++) {
      let component = list[i]
      component.draw(this.ctx)
    }
  }

  Game.prototype.update = function(player) {
    let list = this.components 
    for(let i = 0; i < list.length; i++) {
      let component = list[i]
      component.update()
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
  
  Game.prototype.gameLoop = function() {
    // Clear 
    this.clear()
    // Update 
    this.update()
    // Draw
      // Draw Background 
      this.drawBackground()
      // Draw Elements
      this.draw()
  }
  
  Game.prototype.bindMethods = function() {
    this.update = this.update.bind(this)
    this.draw = this.draw.bind(this)
    this.clear = this.clear.bind(this)
    this.mountDom = this.mountDOM.bind(this)
    this.gameLoop = this.gameLoop.bind(this)
  }

  // Setup Game
  let game = new Game(400, 700, 30, engine)
  console.log(game)
  game.bindMethods()
  game.mountDOM()
  // Player(centreX, centreY, radius, weight, speed, team, game) {
  let player = new Player(300, 300, 50, 1, 1, 'white', game)
  let player2 = new Player(350, 300, 50, 1, 1, 'white', game)
  console.log(player)

  let btn = document.createElement('button') 
  btn.innerHTML = 'press me fam'
  document.body.appendChild(btn)
  let intervalId = setInterval(game.gameLoop, 1000 / game.framerate)

  btn.addEventListener('click', () => {
    clearInterval(intervalId)
  })

  let btn2 = document.createElement('button')
  btn2.innerHTML = 'add force'
  btn2.addEventListener('click', () => {
    player
  })