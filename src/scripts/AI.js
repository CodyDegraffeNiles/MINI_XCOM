import Cover from "./cover.js"
import Util from "./utils.js"

class AI{
  constructor(grid){
    this.grid = grid;
    this.units = [];
    this.unitsIndex = 0;
    this.boundTakeTurn = this.takeTurn.bind(this);
  };

  // adds units for the AI to command
  addUnits(){
    let units = this.grid.units.filter(unit => (unit.enemy === true && !(unit instanceof Cover)));
    units.forEach(unit => {this.units.push(unit)});
  };

  // after each turn resest the AI's units so that if they are destroyed they dont linger.
  emptyUnits(){
    this.units = [];
  };

  // setInterval for taking turn
  setTurnInterval(){
    this.interval = setInterval(this.boundTakeTurn, 2000)
  }
  // Takes a turn with each unit one by one
  takeTurn(){
    if(this.unitsIndex < this.units.length && this.units.length > 0){
      this.commandUnit(this.units[this.unitsIndex]);
      this.unitsIndex ++;
      // Set timeouts so that their is proper rendering of all units
      setTimeout(this.grid.boundErase, 20);
      setTimeout(this.grid.boundDraw, 20);
    } else{
      this.unitsIndex = 0;
      clearInterval(this.interval);
      this.emptyUnits();
    }
  };

    // Commands a unit to either shoot at a target or move to a safe location
    commandUnit(unit){
      let posShots = unit.possibleMoves("shoot");
      let posMoves = unit.possibleMoves("move");
      if (posShots.length >= 1) {
        unit.shoot(posShots[0]);
        this.grid.checkUnits();
      }
      else {
        let enemyShots = this.posEnemyShots();
        let safeMoves = posMoves.filter(move => !(Util.inArray(move, enemyShots)));
        if (safeMoves.length >= 1){
          // Random safe move.
          let safeRandomMove = Math.floor(Math.random() * safeMoves.length);
          unit.move(safeMoves[safeRandomMove]);
        }
        else{
          // Random move if there is no safe move.
          let randomMove = Math.floor(Math.random() * posMoves.length);
          unit.move(posMoves[randomMove]);
        }
      }
    };

    // Gets an array of possible shots from the enemy
    posEnemyShots(){
      let enemyUnits = this.grid.units.filter(unit => unit.enemy === false);
      let posEnemyShots = [];
      enemyUnits.forEach(unit => {
        // Use move, which will be possible shoots in the future. 
        // Also give's the ai a blind spot when the move range is less than
        // the shooting range and does not include up to that shooting point. 
        posEnemyShots = posEnemyShots.concat(unit.possibleMoves("move"));
      });
      return posEnemyShots
    };
}

export default AI;
