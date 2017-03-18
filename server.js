let express = require('express')
let util = require('util')
let app = express()
let path = require('path')
let http = require('http').Server(app);
let io = require('socket.io')(http);
let createdWalls = false,
    createdGoals = false
let json = require('json-fn')
let loop;
let height = 420
let width = 1000
// let goalHeight = height / 3
// let goalWidth = width / 10
let Matter = require('matter-js'),
    Engine = Matter.Engine
let Player = require('./public/js/Player.js')
let Ball = require('./public/js/Ball.js')
let Goal = require('./public/js/Goal.js')



app.use('/public', express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})



http.listen(3000, '0.0.0.0', () => {
  console.log('listening on port 3000')
})


/* SERVERSIDE GAME LOGIC */
// Serverside Game State
let gameState = {
  Matter: Matter,
  engine: Engine.create(),
  matterComponents: {
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
  }, 
  components: {
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
  },
}






io.on('connection', socket => {
  console.log("connection: ", socket.id)
  initialiseGame(socket)
  socket.on('disconnect', () => {
    console.log("DISCONNECT", socket.id) 
    playerLeave(socket.id)
  })
  socket.on('stop', () => clearInterval(loop))
  socket.on('updatePlayerPosition', playerInfo => {
    updatePlayerPosition(socket, playerInfo)
  })

  loop = setInterval(() => gameLoop(socket), 1000 / 60)
})


function putMethodsOnTheObject(obj) {
  for(let i in obj) {
    if(!obj.hasOwnProperty(i)) {
      // Set prototype method on current obj 
      obj[i] = obj[i]
    }
  }
  return obj
}


const gameLoop = (socket) => {
  // updateServerSideGameState()  
  let player = getPlayer(socket.id).player 
  let matterPlayer = getPlayer(socket.id).matter || {}
  gameState.Matter.Engine.update(gameState.engine)
  // console.log('player: ', player)
  let objToEmit = {
    player: player, 
    components: gameState.components,
    velocity: matterPlayer.velocity
  }
  objToEmit = json.stringify(objToEmit)
  updateBallPosition()
  socket.emit('updateFrontEnd', objToEmit)
}

function updateBallPosition() {
  let ball = gameState.components.balls[1]
  let matterBall = gameState.matterComponents.balls[1]
  ball.centreX = matterBall.position.x 
  ball.centreY = matterBall.position.y 

}

const updatePlayerPosition = (socket, playerInfo) => {
  let id = playerInfo.id 
  let newPosition = playerInfo.newPosition 
  // console.log('newPosition', newPosition.x, newPosition.y)
  let matterPlayer = getPlayer(id).matter
  let player = getPlayer(id).player 
  if(matterPlayer) {
    matterPlayer.force.x += newPosition.x 
    matterPlayer.force.y += newPosition.y  
    // gameState.Matter.Body.setVelocity(matterPlayer, {
    //   x: matterPlayer.velocity.x + newPosition.x, 
    //   y: matterPlayer.velocity.y + newPosition.y
    // })
    // console.log(matterPlayer.velocity)
    player.centreX = matterPlayer.position.x 
    player.centreY = matterPlayer.position.y 
  }
    // Wall Collision Check
  // }
}





const getPlayer = id => {
  // console.log('id: ', id, gameState.components.players[id])
  return {
    matter: gameState.matterComponents.players[id], 
    player: gameState.components.players[id]
  }
}




const breakGameLoop = () => {

}


let colours = ['white', 'black', '#2C3E50', '#940315', "#EB7F00"]


const initialiseGame = (socket) => {
  // Initialise a Player 
  let newPlayer = createPlayer(socket)
  // Initialise a Ball 
  let balls = Object.keys(gameState.components.balls)
  if(!balls.length) createBall(socket)
  // Create Matter Objects 
  if(!createdWalls) {
    createdWalls = true
    createWalls(socket)
  }
  if(!createdGoals) {
    createdGoals = true 
    createGoals(socket)
  }
  // Initialise World
  gameState.engine.world.gravity.y = 0
  // Listeners 
  addListeners(socket)
  // Emit Object
    let objToEmit = { 
      player: newPlayer, 
      components: gameState.components
    }
  objToEmit = json.stringify(objToEmit) 
  io.emit('initialiseGameState', objToEmit)
}


/* OBJECT CREATION */

function createPlayer(socket) {
  let colour = colours[Math.floor(Math.random() * 5)]
  // Create Player Obj to Use
  let newPlayer = new Player(200, 200, 20, colour, gameState, socket.id) 
  // Add prototype methods to object to allow json.stringify to work 
  newPlayer = putMethodsOnTheObject(newPlayer)
  gameState.components.players[socket.id] = newPlayer
  let matterObj = gameState.Matter.Bodies.circle(newPlayer.centreX, newPlayer.centreY, newPlayer.radius) 
  matterObj.name = 'player'
  gameState.matterComponents.players[socket.id] = matterObj
  gameState.Matter.World.add(gameState.engine.world, matterObj)
  return newPlayer

}

function createBall(socket) {
  let colour = 'white'
  let newBall = new Ball(width / 2, height / 2, 10, colour)
  newBall = putMethodsOnTheObject(newBall) 
  let numBall = Object.keys(gameState.components.balls).length + 1
  let matterObj = gameState.Matter.Bodies.circle(newBall.centreX, newBall.centreY, newBall.radius)  
  matterObj.restitution = 0.8
  matterObj.matterType = 'ball'
  gameState.components.balls[numBall] = newBall 
  gameState.matterComponents.balls[numBall] = matterObj
  gameState.Matter.World.add(gameState.engine.world, matterObj)
}

function createWalls(socket) {
  // let w = width, h = height, gh = goalHeight, gw = goalWidth
  // Create Actual Walls
  let ground = gameState.Matter.Bodies.rectangle(width/2, height, width, 1, {isStatic: true})
  let ceiling = gameState.Matter.Bodies.rectangle(width/2, 0, width, 1, {isStatic: true})
  let rightWall = gameState.Matter.Bodies.rectangle(width, height / 2, 1, height, {isStatic: true})
  let leftWall = gameState.Matter.Bodies.rectangle(0, height / 2, 1, height, {isStatic: true})
  // let ground = gameState.Matter.Bodies.rectangle((w/2) + gw, h - 2*(gh), w - 2*(gw), 1, {isStatic: true})
  // let ceiling = gameState.Matter.Bodies.rectangle((w/2) + gw, 0, w - 2*(gw), 1, {isStatic: true})
  // let leftWall = gameState.Matter.Bodies.rectangle(gw, gh + (h/2), 1, h - 2*(gh), {isStatic: true})
  // let rightWall = gameState.Matter.Bodies.rectangle(w - gw, gh + (h/2), 1, h - 2*(gh), {isStatic: true})
  gameState.Matter.World.add(gameState.engine.world, [ground, ceiling, rightWall, leftWall])
  // Create Goal Walls  
  // let one = gameState.Matter.Bodies.rectangle(,,,{isStatic: true})
  // let two = gameState.Matter.Bodies.rectangle(,,,{isStatic: true})
  // let three = gameState.Matter.Bodies.rectangle(,,,{isStatic: true})
  // let four = gameState.Matter.Bodies.rectangle(,,,{isStatic: true})
}

function createGoals(socket) {
  let goalPostColour = goalLineColour = 'black' 
  let topGoalPostX = 110 
  let topGoalPostRadius = 10
  let topGoalPostY = (height / 3) + topGoalPostRadius
  let goalLineWidth = 3
  let goalLineHeight = (height / 3) - (4 * topGoalPostRadius)
  // Creater Goal Objects 
  // Goal(topGoalPostX, topGoalPostY, topGoalPostRadius, goalLineHeight, goalLineWidth, goalPostColour, goalLineColour)
  let leftGoal = new Goal(topGoalPostX, topGoalPostY, topGoalPostRadius, goalLineHeight, goalLineWidth, goalPostColour, goalLineColour)
  leftGoal = putMethodsOnTheObject(leftGoal)
  // Create Matter Objects 
  let matterObjTopGoalPost = gameState.Matter.Bodies.circle(topGoalPostX, topGoalPostY, topGoalPostRadius, {isStatic: true})
  let matterObjBottomGoalPost = gameState.Matter.Bodies.circle(leftGoal.bottomGoalPost.centreX, leftGoal.bottomGoalPost.centreY, leftGoal.bottomGoalPost.radius, {isStatic: true})
  let matterObjGoalLine = gameState.Matter.Bodies.rectangle(topGoalPostX, topGoalPostY + leftGoal.goalLine.height / 2, leftGoal.goalLine.width, leftGoal.goalLine.height, {
    isStatic: true,
    isSensor: true
  })
  matterObjGoalLine.team = 'left'
  // Add Goal Objects to Game State 
  gameState.components.goals.leftGoal = leftGoal
  // Add Matter Objects to Game State 
  gameState.matterComponents.goals.leftGoal = {
    topGoalPost: matterObjTopGoalPost, 
    bottomGoalPost: matterObjBottomGoalPost,
    goalLine: matterObjGoalLine
  }
  // Add Matter Objects to world
  gameState.Matter.World.add(gameState.engine.world, [matterObjTopGoalPost, matterObjBottomGoalPost, matterObjGoalLine])




  // Create Right Goal
  let rightGoal = new Goal(width - topGoalPostX, topGoalPostY, topGoalPostRadius, goalLineHeight, goalLineWidth, goalPostColour, goalLineColour)
  rightGoal = putMethodsOnTheObject(rightGoal)
  let matterObjTopGoalPostRight = gameState.Matter.Bodies.circle(width - topGoalPostX, topGoalPostY, topGoalPostRadius, {isStatic: true})
  let matterObjBottomGoalPostRight = gameState.Matter.Bodies.circle(width - topGoalPostX, rightGoal.bottomGoalPost.centreY, rightGoal.bottomGoalPost.radius, {isStatic: true})
  // topGoalPostX, topGoalPostY + leftGoal.goalLine.height / 2, leftGoal.goalLine.width, leftGoal.goalLine.height 
  // (width - topGoalPostX), topGoalPostY + rightGoal.goalLine.height / 2, rightGoal.goalLine.width, rightGoal.goalLine.height 
  let matterObjGoalLineRight = gameState.Matter.Bodies.rectangle((width - topGoalPostX), topGoalPostY + rightGoal.goalLine.height / 2, rightGoal.goalLine.width, rightGoal.goalLine.height , {
    isStatic: true,
    isSensor: true
  })
  matterObjGoalLineRight.team = 'right'
  // // Add Goal Objects to Game State 
  gameState.components.goals.rightGoal = rightGoal
  // // Add Matter Objects to Game State 
  gameState.matterComponents.goals.rightGoal = {
    topGoalPost: matterObjTopGoalPostRight, 
    bottomGoalPost: matterObjBottomGoalPostRight,
    goalLine: matterObjGoalLineRight
  }
  
  
  gameState.Matter.World.add(gameState.engine.world, [matterObjTopGoalPostRight, matterObjBottomGoalPostRight, matterObjGoalLineRight])


}

const playerLeave = (socketId) => {
  gameState.Matter.World.remove(gameState.engine.world, getPlayer(socketId).matter)
  delete gameState.components.players[socketId] 
  delete gameState.matterComponents.players[socketId]
}


/* OTHER SHIT */

function addListeners(socket) {
  gameState.Matter.Events.on(gameState.engine, 'collisionStart', event => {
    let pairs = event.pairs 
    for(let i = 0; i < pairs.length; i++) {
      let pair = pairs[i]
      // console.log(pair.bodyA.label, pair.bodyA.isStatic, pair.bodyA.isSensor, pair.bodyB.label, pair.bodyB.isStatic, pair.bodyB.isSensor)
      // 
      if(pair.bodyA.isSensor && pair.bodyB.matterType === 'ball' || pair.bodyA.matterType === 'ball' && pair.bodyB.isSensor) {
        console.log("GOAL") 
        let sensor = pair.bodyA.isSensor ? pair.bodyA : pair.bodyB
        // Reset Positions 
        let ball = gameState.matterComponents.balls[1] 
        ball.velocity.x = 0 
        ball.velocity.y = 0
        gameState.Matter.Body.setPosition(ball, {
          x: width / 2, 
          y: height / 2
        })
        gameState.Matter.Body.setVelocity(ball, {
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