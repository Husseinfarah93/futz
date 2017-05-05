// Imports  
let socket = io()
let framerate2 = 60, 
  framerate1 = 100
let frontEndGame = require('./FrontEndGame.js')
let gameState;
let json = require('json-fn')
let clearButton = document.createElement('button')
clearButton.innerHTML = 'clear'
// document.body.appendChild(clearButton)




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
    document.body.appendChild(clearButton)
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








// let timeoutFunction = setTimeout(frontEndGameState.updateBackEnd, 1000 / framerate)
function loops() {
  // frontEndLoop = setInterval(gameState.gameLoopFrontEnd, 1000 / framerate1)
  window.requestAnimationFrame(gameState.gameLoopFrontEnd)
  backEndLoop = setInterval(gameState.updateBackEnd, 1000 / framerate2)
}

clearButton.addEventListener('click', () => {
  clearInterval(frontEndLoop) 
  clearInterval(backEndLoop)
  socket.emit('stop', {})
})







