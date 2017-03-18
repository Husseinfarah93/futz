function Goal(topGoalPostX, topGoalPostY, topGoalPostRadius, goalLineHeight, goalLineWidth, goalPostColour, goalLineColour) {
  this.topGoalPost = {
    centreX: topGoalPostX, 
    centreY: topGoalPostY, 
    radius: topGoalPostRadius, 
    colour: goalPostColour
  }
  this.bottomGoalPost = {
    centreX: topGoalPostX, 
    centreY: topGoalPostY + goalLineHeight + (2*topGoalPostRadius), 
    radius: topGoalPostRadius, 
    colour: goalPostColour
  }
  this.goalLine = {
    x: topGoalPostX - goalLineWidth / 2, 
    y: topGoalPostY + topGoalPostRadius, 
    height: goalLineHeight, 
    width: goalLineWidth,
    colour: goalLineColour
  }
}


Goal.prototype.draw = function(ctx) {
  // Draw Top Goal Post 
  ctx.fillStyle = this.topGoalPost.colour
  ctx.beginPath() 
  ctx.arc(this.topGoalPost.centreX, this.topGoalPost.centreY, this.topGoalPost.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
  // Draw Bottom Goal Post 
  ctx.fillStyle = this.bottomGoalPost.colour
  ctx.beginPath() 
  ctx.arc(this.bottomGoalPost.centreX, this.bottomGoalPost.centreY, this.bottomGoalPost.radius, 0, 2 * Math.PI, false)
  ctx.fill() 
  // Draw Goal Line
  ctx.fillStyle = this.goalLine.colour
  ctx.fillRect(this.goalLine.x, this.goalLine.y, this.goalLine.width, this.goalLine.height)
}


module.exports = Goal