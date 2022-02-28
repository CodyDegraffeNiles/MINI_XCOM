import Utils from "./utils.js";

class Unit{
  constructor(options){
    // Position is in [0,0] - 2d array format, is converted mathmatically
    // into the center of a square on the board.
    this.pos = options.pos;
    this.health = options.health;
    this.movementRange = options.movementRange;
    this.shootingRange = options.shootingRange;
    this.shootingPower = options.shootingPower;
    this.enemy = options.enemy;
    this.name = options.name;
    this.actionLeft = false;
    this.grid = "grid";
  }
  draw(){
    const canvas = (document.getElementsByClassName('game-board'))[0];
    const ctx = canvas.getContext('2d');
    // Yellow for friendly units and green for enemy forces.
    let color = "yellow";
    if (this.enemy){color = "green"};
    ctx.fillStyle = color;
     // Get the center of the square of the units position
    let center_x = this.pos[0] * 80 + 40;
    let center_y = this.pos[1] * 80 + 40;
    ctx.beginPath();
    ctx.arc(center_x, center_y, 20, 0, 2 * Math.PI, false);
    ctx.fill();
  }
  move(pos){
    // Check if move is valid]
    if( this.actionLeft === false){
      alert("Unit has already acted!")
      return false;
    }
    let posMoves = this.posssibleMoves();
    if (Utils.inArray(pos, posMoves)){
      this.takeAction();
      this.pos[0] = pos[0];
      this.pos[1] = pos[1];
      return true;
    }
    else{
      alert("Invalid Move");
      return false;
    }
  }

  // Returns an array of possible moves/shoots for the unit; Important for the AI
  // Determine which one by passing in type of action as parameter
  posssibleMoves(action = "move"){
    let range = this.movementRange;
    if (action === "shoot"){range = this.shootingRange};
    let posMoves = [];
    directions.forEach(dir => {
      let orgX = this.pos[0];
      let orgY = this.pos[1];
      for (let i = 0; i < range; i++){
        orgX = orgX + dir[0];
        orgY = orgY + dir[1];
        if (this.isValidMove([orgX, orgY]) && !this.grid.occupiedPos([orgX, orgY])){
          // adds empty position if action is move.
          if (action === "move") { posMoves.push([orgX, orgY]) };
        }
        else if (this.isValidMove([orgX, orgY]) && this.grid.occupiedPos([orgX, orgY])){
        // adds occupied position if action is shot.
          if (action === "shoot"){posMoves.push([orgX, orgY])};
          break
        }
        else {
          break;
        }
      };
    })
    return posMoves;
  };

  // Checks to see if move is within the boundries of the gird.
  isValidMove(pos){
    let posX = pos[0];
    let posY = pos[1];
    // Check if it is in valid bounds.
    if (posX > 7 || posX < 0 || posY > 7 || posY < 0) {
      return false;
    }
    return true;
  };

  // The unit shoots at target location
  shoot(pos) {
    // Check if a unit can act.
    if (this.actionLeft === false) {
      alert("Unit has already acted!")
      return false;
    }
    let posMoves = this.posssibleMoves("shoot")
    if (Utils.inArray(pos, posMoves)) {
      this.takeAction();
      let target = this.grid.getUnit(pos);
      target.takeDamage(this.shootingPower);
      return true;
    }
    else {
      alert("Invalid Shot location")
      return false;
    }
  };

  // Causes the unit to take damage
  takeDamage(amount) {
    this.health -= amount;
  };

  // sets this.grid equal to a specific grid
  joinGrid(newGrid){
    this.grid = newGrid;
  };

  // Allows for an action to take place.
  gainAction(){
    this.actionLeft = true;
    this.grid.actionableUnits.push(this);
  };

  // the unit takes an action so its actionLeft is set to false.
  takeAction() {
    this.actionLeft = false;
    if(this.grid.actionableUnits.includes(this)){
      this.grid.removeFromActionableUnits(this);
    }
  };

  // Checks if enemey
  isEnemy(){
    if (this.enemy == true){
      return true
    }
    return false
  }
};

export default Unit;

// Possible directions that an action can be taken in.
const directions = [
  [0,1],
  [0,-1],
  [1,0],
  [-1,0],
  [1,1],
  [-1,-1],
  [1,-1],
  [-1,1]
]