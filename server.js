let express = require('express')
let util = require('util')
let app = express()
let path = require('path')
let http = require('http').Server(app);
let io = require('socket.io')(http);
let Player = require('./public/js/Player.js')
let json = require('json-fn')
let loop;
let Matter = require('matter-js'),
    Engine = Matter.Engine




app.use('/public', express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})



http.listen(3000, () => {
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
      // Ball object
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

  loop = setInterval(() => gameLoop(socket), 1000 / 30)
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
  gameState.Matter.Engine.update(gameState.engine)
  // updateServerSideGameState()  
  let player = getPlayer(socket.id).player 
  // console.log('player: ', player)
  let objToEmit = {
    player: player, 
    components: gameState.components
  }
  objToEmit = json.stringify(objToEmit)
  socket.emit('updateFrontEnd', objToEmit)
}

const updatePlayerPosition = (socket, playerInfo) => {
  let id = playerInfo.id 
  let newPosition = playerInfo.newPosition 
  console.log('newPosition', newPosition)
  let matterPlayer = getPlayer(id).matter, 
      player = getPlayer(id).player 
  console.log('position: ', matterPlayer.position)
  matterPlayer.force.x += newPosition.x 
  matterPlayer.force.y += newPosition.y  
  player.centreX = matterPlayer.position.x 
  player.centreY = matterPlayer.position.y
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

const initialiseGame = (socket) => {
  // Player(centreX, centreY, radius, team, game, socketID) {
  let newPlayer = new Player(200, 200, 20, 'white', gameState, socket.id)
  newPlayer = putMethodsOnTheObject(newPlayer)
  gameState.components.players[socket.id] = newPlayer
  let objToEmit = { 
    player: newPlayer, 
    components: gameState.components
  }
  let matterObj = gameState.Matter.Bodies.circle(newPlayer.centreX, newPlayer.centreY, newPlayer.radius) 
  gameState.engine.world.gravity.y = 0
  gameState.matterComponents.players[socket.id] = matterObj
  gameState.Matter.World.add(gameState.engine.world, matterObj)
  objToEmit = json.stringify(objToEmit) 
  io.emit('initialiseGameState', objToEmit)
}

const playerLeave = (socketId) => {
  delete gameState.components.players[socketId] 
  delete gameState.matterComponents.players[socketId]
}