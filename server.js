let express = require('express')
let util = require('util')
let app = express()
let path = require('path')
let http = require('http').Server(app);
let io = require('socket.io')(http);
let Player = require('./public/js/Player.js')
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

io.on('connectiona', socket => {
  console.log("connection: ", socket.id)
  // Player(centreX, centreY, radius, team, game) {
  let newPlayer = new Player(300, 300, 50, 'blue', gameState, socket.id)
  gameState.components.players[socket.id] = newPlayer
  let objToEmit = { 
    player: newPlayer, 
    components: gameState.components
  }
  // this.matterObj = game.Matter.Bodies.circle(this.centreX, this.centreY, this.radius)
  // game.Matter.World.add(game.engine.world, this.matterObj)
  let matterObj = gameState.Matter.Bodies.circle(newPlayer.centreX, newPlayer.centreY, newPlayer.radius) 
  console.log('draw function: ', newPlayer)
  gameState.Matter.World.add(gameState.engine.world, matterObj)
  // objToEmit = JSON.stringify(util.inspect(objToEmit))
  console.log(stringify(objToEmit))
  // io.emit('initialiseGameState', stringify(objToEmit)) 
  io.emit('initialiseGameState', {a: '', b: 'function() {}'})
})


function Cons() {
  this.prop = 'property' 
}
function putMethodsOnTheObject(obj) {
  for(let i in obj) {
    if(!obj.hasOwnProperty(i)) {
      // Set prototype method on current obj 
      obj[i] = [obj[i]]
    }
  }
  return obj
}
Cons.prototype.func = function() {
  console.log("ASFIOUNSAFION")
}
io.on('connection', socket => {
  let obj = new Cons() 
  obj = putMethodsOnTheObject(obj)
  io.emit('initialiseGameState', obj)
  console.log(obj)
})

function stringify(obj) {
  for(var i in obj) {
    if(!obj.hasOwnProperty(i)) obj[i] = obj[i] 
  } 
  obj =  obj
  return JSON.stringify(obj, (key, value) => {
    console.log(key)
    if(typeof value === 'function') console.log('**')
    return typeof value === 'function' ? value.toString() : value
  })
}

// io.emit('updateGameState', {

// })

io.on('updatePlayer', player => {

})

const gameLoop = () => {
  updateServerSideGameState()

}

const setUpGameState = () => {

}

const breakGameLoop = () => {

}

const addPlayerToGameState = (socket) => {

}