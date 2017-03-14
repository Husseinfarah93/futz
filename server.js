let express = require('express')
let util = require('util')
let app = express()
let path = require('path')
let http = require('http').Server(app);
let io = require('socket.io')(http);
let Player = require('./public/js/Player.js')
let json = require('json-fn')
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
})

io.on('disconnet', socket => {
  console.log("disconnet: ", socket.id)
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


const gameLoop = () => {
  updateServerSideGameState()

}

const setUpGameState = () => {

}

const breakGameLoop = () => {

}

const initialiseGame = (socket) => {
    // Player(centreX, centreY, radius, team, game, socketID) {
  let newPlayer = new Player(300, 300, 50, 'blue', gameState, socket.id)
  newPlayer = putMethodsOnTheObject(newPlayer)
  gameState.components.players[socket.id] = newPlayer
  let objToEmit = { 
    player: newPlayer, 
    components: gameState.components
  }
  let matterObj = gameState.Matter.Bodies.circle(newPlayer.centreX, newPlayer.centreY, newPlayer.radius) 
  gameState.Matter.World.add(gameState.engine.world, matterObj)
  objToEmit = json.stringify(objToEmit) 
  console.log("currentGameState: ", gameState)
  io.emit('initialiseGameState', objToEmit)
}

const playerLeave = (socketId) => {
  delete gameState.components.players[socketId]
}