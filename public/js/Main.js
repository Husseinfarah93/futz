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







