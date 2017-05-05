function putMethodsOnTheObject(obj) {
  for(let i in obj) {
    if(!obj.hasOwnProperty(i)) {
      // Set prototype method on current obj 
      obj[i] = obj[i]
    }
  }
  return obj
}

function getPlayer(gameState, id) {
  return {
    matter: gameState.matterComponents.players[id], 
    player: gameState.components.players[id]
  }
}

module.exports = {
  putMethodsOnTheObject: putMethodsOnTheObject,
  getPlayer: getPlayer
}
