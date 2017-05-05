let putMethodsOnTheObject = require('./helpers.js').putMethodsOnTheObject 
let getPlayer = require('./helpers.js').getPlayer
let Matter = require('matter-js'),
    Engine = Matter.Engine
let Player = require('./public/js/Player.js')
let Ball = require('./public/js/Ball.js')
let Goal = require('./public/js/Goal.js')
let teams = 0
let json = require('json-fn')
let height = 420 * 2
let width = 1000 * 1.5

// Object
function GameState() {
  //Host
  this.host =  ''
  this.createdComponents = {
    ball: false,
    walls: false, 
    goals: false
  }
  this.Matter = Matter 
  this.engine = Engine.create()
  this.matterComponents = {
    players: {
      // 'socketId': 'asfoinasofin'
    },
    pitch: {
      // Pitch object
    },
    balls: {
      // Ball objects
    },
    goals: {
      // Goals Objects
    }
  }
  this.components = {
    players: {
      // 'socketId': 'asfoinasofin'
    },
    pitch: {
      // Pitch object
    },
    balls: {
      // Ball object
    }, 
    goals: {

    }
  }
}

GameState.prototype.initialiseWorld = function() {
  this.engine.world.gravity.y = 0
}

GameState.prototype.addEngineListeners = function(socket) {
  this.Matter.Events.on(this.engine, 'collisionStart', event => {
    let pairs = event.pairs 
    for(let i = 0; i < pairs.length; i++) {
      let pair = pairs[i]
      if(pair.bodyA.isSensor && pair.bodyB.matterType === 'ball' || pair.bodyA.matterType === 'ball' && pair.bodyB.isSensor) {
        console.log("GOAL") 
        let sensor = pair.bodyA.isSensor ? pair.bodyA : pair.bodyB
        // Reset Positions 
        let ball = this.matterComponents.balls[1] 
        ball.velocity.x = 0 
        ball.velocity.y = 0
        this.Matter.Body.setPosition(ball, {
          x: width / 2, 
          y: height / 2
        })
        this.Matter.Body.setVelocity(ball, {
          x: 0, 
          y: 0
        })
        // Emit Goal Event 
        console.log(sensor.team)
        socket.emit('goal', {
          team: sensor.team
        })
      }
    }
  })
}

GameState.prototype.updateEngineLoop = function(fps) {
  this.Matter.Engine.update(this.engine, fps / 1000)
}

GameState.prototype.stopEngineUpdateLoop = function() {
  this.Matter.Engine.clear(this.engine)
}

GameState.prototype.updateFrontEndLoop = function(fps, socket) {
  let self = this
  function updateFront() {
    let player = getPlayer(self, socket.id).player 
    let matterPlayer = getPlayer(self, socket.id).matter || {}
    self.Matter.Engine.update(self.engine)
    let objToEmit = {
      player: player, 
      components: self.components,
    }
    objToEmit = json.stringify(objToEmit)
    self.updateBalls()
    socket.emit('updateFrontEnd', objToEmit)
  }
  updateLoopFrontEnd = setInterval(updateFront, 1000 / fps)
}

GameState.prototype.stopFrontEndUpdateLoop = function() {
  clearInterval(updateLoopFrontEnd)
}

GameState.prototype.stop = function() {
  this.stopEngineUpdateLoop() 
  this.stopFrontEndUpdateLoop()
}

// Component Updates 

GameState.prototype.updatePlayerPosition = function(socket, playerInfo) {
  let id = playerInfo.id 
  let newPosition = playerInfo.newPosition 
  let matterPlayer = getPlayer(this, id).matter
  let player = getPlayer(this, id).player 
  if(matterPlayer) {
    matterPlayer.force.x += newPosition.x 
    matterPlayer.force.y += newPosition.y  
    player.centreX = matterPlayer.position.x 
    player.centreY = matterPlayer.position.y 
  }
}

GameState.prototype.updatePlayers = function() {
 // 
} 

GameState.prototype.updateBalls = function() {
  let ball = this.components.balls[1]
  let matterBall = this.matterComponents.balls[1]
  ball.centreX = matterBall.position.x 
  ball.centreY = matterBall.position.y 
}

GameState.prototype.updateGoals = function() {

}


// Component Creation


GameState.prototype.createPlayer = function(socket) {
  let colours = ['white', 'black', '#2C3E50', '#940315', "#EB7F00"]
  let colour = colours[Math.floor(Math.random() * 5)]
  // Create Player Obj to Use
  if(teams === 0) {
    w = 1
    h = 1 
    teams += 1
  }
  else if(teams === 1) {
    w = 3
    teams -= 1
  }

  let newPlayer = new Player(w * (width / 4), height / 2, 20, colour, this, socket.id) 
  // Add prototype methods to object to allow json.stringify to work 
  newPlayer = putMethodsOnTheObject(newPlayer)
  this.components.players[socket.id] = newPlayer
  let matterObj = this.Matter.Bodies.circle(newPlayer.centreX, newPlayer.centreY, newPlayer.radius) 
  matterObj.name = 'player'
  this.matterComponents.players[socket.id] = matterObj
  this.Matter.World.add(this.engine.world, matterObj)
  return newPlayer
}

GameState.prototype.createBall = function(socket) {
  let colour = 'white'
  let newBall = new Ball(width / 2, height / 2, 15, colour)
  newBall = putMethodsOnTheObject(newBall) 
  let numBall = Object.keys(this.components.balls).length + 1
  let matterObj = this.Matter.Bodies.circle(newBall.centreX, newBall.centreY, newBall.radius)  
  matterObj.restitution = 1
  matterObj.matterType = 'ball'
  this.components.balls[numBall] = newBall 
  this.matterComponents.balls[numBall] = matterObj
  this.Matter.World.add(this.engine.world, matterObj)
}

GameState.prototype.createWalls = function(socket) {
  // Create Actual Walls
  let ground = this.Matter.Bodies.rectangle(width/2, height, width, 1, {isStatic: true})
  ground.restitution = 0.8
  let ceiling = this.Matter.Bodies.rectangle(width/2, 0, width, 1, {isStatic: true})
  ceiling.restitution = 0.8
  let rightWall = this.Matter.Bodies.rectangle(width, height / 2, 1, height, {isStatic: true})
  rightWall.restitution = 0.8
  let leftWall = this.Matter.Bodies.rectangle(0, height / 2, 1, height, {isStatic: true})
  leftWall.restitution = 0.8
  this.Matter.World.add(this.engine.world, [ground, ceiling, rightWall, leftWall])
}

GameState.prototype.createGoals = function(socket) {
  let goalPostColour = goalLineColour = 'black' 
  let topGoalPostX = 110 
  let topGoalPostRadius = 10
  let topGoalPostY = (height / 3) + topGoalPostRadius
  let goalLineWidth = 3
  let goalLineHeight = (height / 3) - (4 * topGoalPostRadius)
  // Creater Goal Objects 
  let leftGoal = new Goal(topGoalPostX, topGoalPostY, topGoalPostRadius, goalLineHeight, goalLineWidth, goalPostColour, goalLineColour)
  leftGoal = putMethodsOnTheObject(leftGoal)
  // Create Matter Objects 
  let matterObjTopGoalPost = this.Matter.Bodies.circle(topGoalPostX, topGoalPostY, topGoalPostRadius, {isStatic: true})
  let matterObjBottomGoalPost = this.Matter.Bodies.circle(leftGoal.bottomGoalPost.centreX, leftGoal.bottomGoalPost.centreY, leftGoal.bottomGoalPost.radius, {isStatic: true})
  let matterObjGoalLine = this.Matter.Bodies.rectangle(topGoalPostX, topGoalPostY + leftGoal.goalLine.height / 2, leftGoal.goalLine.width, leftGoal.goalLine.height, {
    isStatic: true,
    isSensor: true
  })
  matterObjGoalLine.team = 'left'
  // Add Goal Objects to Game State 
  this.components.goals.leftGoal = leftGoal
  // Add Matter Objects to Game State 
  this.matterComponents.goals.leftGoal = {
    topGoalPost: matterObjTopGoalPost, 
    bottomGoalPost: matterObjBottomGoalPost,
    goalLine: matterObjGoalLine
  }
  // Add Matter Objects to world
  this.Matter.World.add(this.engine.world, [matterObjTopGoalPost, matterObjBottomGoalPost, matterObjGoalLine])




  // Create Right Goal
  let rightGoal = new Goal(width - topGoalPostX, topGoalPostY, topGoalPostRadius, goalLineHeight, goalLineWidth, goalPostColour, goalLineColour)
  rightGoal = putMethodsOnTheObject(rightGoal)
  let matterObjTopGoalPostRight = this.Matter.Bodies.circle(width - topGoalPostX, topGoalPostY, topGoalPostRadius, {isStatic: true})
  let matterObjBottomGoalPostRight = this.Matter.Bodies.circle(width - topGoalPostX, rightGoal.bottomGoalPost.centreY, rightGoal.bottomGoalPost.radius, {isStatic: true})
  let matterObjGoalLineRight = this.Matter.Bodies.rectangle((width - topGoalPostX), topGoalPostY + rightGoal.goalLine.height / 2, rightGoal.goalLine.width, rightGoal.goalLine.height , {
    isStatic: true,
    isSensor: true
  })
  matterObjGoalLineRight.team = 'right'
  // // Add Goal Objects to Game State 
  this.components.goals.rightGoal = rightGoal
  // // Add Matter Objects to Game State 
  this.matterComponents.goals.rightGoal = {
    topGoalPost: matterObjTopGoalPostRight, 
    bottomGoalPost: matterObjBottomGoalPostRight,
    goalLine: matterObjGoalLineRight
  }
  
  
  this.Matter.World.add(this.engine.world, [matterObjTopGoalPostRight, matterObjBottomGoalPostRight, matterObjGoalLineRight])


}


/* Game Actions */

// Initialise/Start Game 

GameState.prototype.initialiseGame = function(socket, io) {
  // Initialise a Player 
  let newPlayer = this.createPlayer(socket)
  // Initialise a Ball 
  if(!this.createdComponents.ball) {
    this.createBall(socket)
    this.createdComponents.ball = true
  }
  // Create Matter Objects 
  if(!this.createdComponents.walls) {
    this.createdComponents.walls = true
    this.createWalls(socket)
  }
  if(!this.createdComponents.goals) {
    this.createdComponents.createdGoals = true 
    this.createGoals(socket)
  }
  // Initialise World
  this.initialiseWorld()
  // Listeners 
  this.addEngineListeners(socket)
  // Emit Object
    let objToEmit = { 
      player: newPlayer, 
      components: this.components
    }
  objToEmit = json.stringify(objToEmit) 
  io.emit('initialiseGameState', objToEmit)
}

GameState.prototype.playerLeave = function(socketId) {
  this.Matter.World.remove(this.engine.world, getPlayer(this, socketId).matter)
  delete this.components.players[socketId] 
  delete this.matterComponents.players[socketId]
}




// Return all components to default position
GameState.prototype.backToDefault = function() {

}



module.exports = GameState