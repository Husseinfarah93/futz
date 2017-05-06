let express = require('express')
let util = require('util')
let app = express()
let path = require('path')
let http = require('http').Server(app);
let json = require('json-fn')
let io = require('socket.io')(http);
let previousBackEndUpdate = playerId = undefined
let GameState = require('./GameState.js'), 
  gameState = new GameState()

app.use('/public', express.static(path.join(__dirname, '/public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})



http.listen(3000, '0.0.0.0', () => {
  console.log('listening on port 3000')
})




io.on('connection', socket => {
  console.log("connection: ", socket.id)
  gameState.initialiseGame(socket, io)

  socket.on('disconnect', () => {
    console.log("DISCONNECT", socket.id) 
    gameState.playerLeave(socket.id)
  })

  socket.on('stop', gameState.stop)

  socket.on('updatePlayerPosition', playerInfo => {
    gameState.updatePlayerPosition(socket, playerInfo)
  })

  gameState.updateEngineLoop(60)
  gameState.updateFrontEndLoop(40, socket)
})