// watchify /Users/Hussein/Desktop/testProjects/futz/public/js/Main.js -o /Users/Hussein/Desktop/testProjects/futz/public/js/bundle.js 
/* 
Checklist: 
- Architecture with Pitch, Background etc ✓
- Ball ✓
- Collision Detection ✓
- Physics Engine ✓
- Sockets + new players
*/
/*

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
    engine.world.gravity.y = 0



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
      let backgroundImage = new Image() 
      backgroundImage.src = 'https://thumbs.dreamstime.com/t/soccer-field-vector-illustration-football-lines-areas-marking-football-size-regulations-m-69316203.jpg'
      
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
    let ground = Bodies.rectangle(game.canvas.width/2, game.canvas.height, game.canvas.width, 1, {isStatic: true})
    ground.name = 'ground'
    let ceiling = Bodies.rectangle(game.canvas.width/2, 0, game.canvas.width, 1, {isStatic: true})
    ceiling.name = 'ceiling'
    let rightWall = Bodies.rectangle(game.canvas.width, game.canvas.height / 2, 1, game.canvas.height, {isStatic: true})
    rightWall.name = 'rightWall'
    let leftWall = Bodies.rectangle(0, game.canvas.height / 2, 1, game.canvas.height, {isStatic: true})
    leftWall.name = 'leftWall'
    World.add(engine.world, [ground, ceiling, rightWall, leftWall]);
    // Player(centreX, centreY, radius, weight, speed, team, game, id) {
    let player = new Player(game.canvas.width / 4, game.canvas.height / 2, 10, 1, 1, 'white', game, 'player1')
    let player2 = new Player(3 * game.canvas.width / 4, game.canvas.height / 2, 10, 1, 1, 'purple', game, 'player2')
    let ball =  new Player(game.canvas.width / 2, game.canvas.height / 2, 7, 1, 0.5, 'black', game, 'ball')
    console.log(player)

    let btn = document.createElement('button') 
    btn.innerHTML = 'stop game loop'
    document.body.appendChild(btn)
    let intervalId = setInterval(game.gameLoop, 1000 / game.framerate)

    btn.addEventListener('click', () => {
      clearInterval(intervalId)
    })


    window.addEventListener('keydown', e => {
      if(e.keyCode === 37) player.matterObj.force.x -= 0.001
      else if(e.keyCode === 38) player.matterObj.force.y -= 0.001
      else if(e.keyCode === 39) player.matterObj.force.x += 0.001
      else if(e.keyCode === 40) player.matterObj.force.y += 0.001
      if(e.keyCode === 65) player2.matterObj.force.x -= 0.001
      else if(e.keyCode === 87) player2.matterObj.force.y -= 0.001
      else if(e.keyCode === 68) player2.matterObj.force.x += 0.001
      else if(e.keyCode === 83) player2.matterObj.force.y += 0.001
      else if(e.keyCode === 32) player.matterObj.spaceDown = true
    })

    window.addEventListener('keyup', () => {
      player.matterObj.spaceDown = false
    })


    Events.on(engine, 'collisionStart', event => {
      let pairs = event.pairs 
      for(let i = 0; i < pairs.length; i++) {
        let pair = pairs[i] 
        let bodyA = pair.bodyA 
        let bodyB = pair.bodyB
        if((bodyA.name === 'ball' || bodyA.name === 'rightWall') && (bodyB.name === 'ball' || bodyB.name === 'rightWall')) {
          increaseSCoreRight()
          moveBallBackToMiddle()
        }
        else if((bodyA.name === 'ball' || bodyA.name === 'leftWall') && (bodyB.name === 'ball' || bodyB.name === 'leftWall')) {
          increaseScoreLeft()
          moveBallBackToMiddle()
        }
        else if((bodyA.name === 'ball' || bodyA.name === 'ceiling') && (bodyB.name === 'ball' || bodyB.name === 'leftWall')) {
          let ball = bodyA.name === 'ball' ? bodyA : bodyB 
          console.log("****")
          console.log(ball.force.x, ball.force.y)
          ball.velocity.x = -ball.velocity.x 
          ball.velocity.y = -ball.velocity.y
          console.log(ball.force.x, ball.force.y)
        }
        
      }
    })

    let scoreLeft = document.createElement('p')
    scoreLeft.innerHTML = 0
    let scoreRight = document.createElement('p')
    scoreRight.innerHTML = 0 
    document.body.appendChild(scoreLeft)
    document.body.appendChild(scoreRight)


    function increaseScoreLeft() { 
      scoreLeft.innerHTML = parseInt(scoreLeft.innerHTML) + 1 
    }
    function increaseSCoreRight() {
      scoreRight.innerHTML = parseInt(scoreRight.innerHTML) + 1 
    }

    function moveBallBackToMiddle() {
      Matter.Body.setPosition(ball.matterObj, {x: game.canvas.width / 2, y: game.canvas.height / 2})
      Matter.Body.setVelocity(ball.matterObj, {x: 0, y: 0})

      Matter.Body.setPosition(player.matterObj, {x: game.canvas.width / 4, y: game.canvas.height / 2})
      Matter.Body.setVelocity(player.matterObj, {x: 0, y: 0})

      Matter.Body.setPosition(player2.matterObj, {x: 3 * game.canvas.width / 4, y: game.canvas.height / 2})
      Matter.Body.setVelocity(player2.matterObj, {x: 0, y: 0})

    }

*/

/*
Game Class 




*/

