// Imports  
let socket = io()
let frontEndGame = require('./FrontEndGame.js')
let gameState;
let json = require('json-fn')
let previousBackEndUpdate;
let settings = document.getElementById('settingsButton')
let gameMode = document.getElementById('gameMode')
let play = document.getElementById('playButton')
let shouldDisplaySettings = false
let shouldDisplayGameMode = false




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


function loops() {
  window.requestAnimationFrame(gameState.gameLoopFrontEnd)
  backEndLoop = setInterval(gameState.updateBackEnd, 1000 / 60)
}




settings.addEventListener('click', () => {
  	let elem = document.getElementById('settingsText')	
    if(shouldDisplaySettings) {
			elem.style.display = 'none'
    }
    else {
    	elem.style.display = 'block'
    }
    shouldDisplaySettings = !shouldDisplaySettings
})

gameMode.addEventListener('click', () => {
  	let elem = document.getElementById('gameModeText')	
    if(shouldDisplayGameMode) {
			elem.style.display = 'none'
    }
    else {
    	elem.style.display = 'block'
    }
    shouldDisplayGameMode = !shouldDisplayGameMode
})

play.addEventListener('click', () => {
	let modal = document.getElementById('modal')
  modal.style.display = 'none'
  socket.emit('initialiseGame')
})








