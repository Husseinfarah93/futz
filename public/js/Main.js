// Imports 
let socket = io()
let framerate = 30
let frontEndGame = require('./FrontEndGame.js')
let gameState;

let clearButton = document.createElement('button')
clearButton.innerHTML = 'clear'
document.body.appendChild(clearButton)




// Socket Events 
socket.on('initialiseGameState', gameStateComponents => {
  console.log("HERE", typeof gameStateComponents, gameStateComponents)
  // gameStateComponents = JSON.parse(gameStateComponents)
  // gameState = new frontEndGame(350, 500, gameStateComponents.player)
  // gameState.components = gameStateComponents.components
  // gameState.socket = socket
  // gameState.player = gameStateComponents.player
  // console.log("GAMESTATE: ", gameState)
  // // gameState.initialise()
  // gameState.draw()
})






// let timeoutFunction = setTimeout(frontEndGameState.updateBackEnd, 1000 / framerate)

clearButton.addEventListener('click', () => {
  clearInterval(timeoutFunction)
})






// Initialise Game Data  
