class Soko {
  constructor(height, width) {
    this.width = width;
    this.height = height;

    this.won = false;
    this.lost = false;

    this.wall = "🟦";
    this.empty = ":black_large_square:";
    this.player = "😳";
    this.ball = "🔘";
    this.goal = "❎";

    this.grids = [];

    this.playerLocation = this.getRandomXY();
    this.ballLocation = this.getRandomXY();
    this.goalLocation = this.getRandomXY();

    this.generateGrid();
  }

  generateGrid() {
    for (let i = 0; i < this.height; i++) {
      this.grids.push([]);
      for (let j = 0; j < this.width; j++) {
        if (this.shouldAddThing([j, i], this.playerLocation)) {
          this.grids[i].push(this.player);
        } else if (this.shouldAddThing([j, i], this.goalLocation)) {
          this.grids[i].push(this.goal);
        } else if (this.shouldAddThing([j, i], this.ballLocation)) {
          this.grids[i].push(this.ball);
        } else if (
          i == 0 ||
          i == this.height - 1 ||
          j == 0 ||
          j == this.width - 1
        ) {
          this.grids[i].push(this.wall);
        } else {
          this.grids[i].push(this.empty);
        }
      }
    }
  }

  reGenerateGrid(direction) {
    let newPlayerLocation = this.getNewLocation(direction, this.playerLocation);
    let newBallLocation = this.ballLocation;

    if (
      newPlayerLocation[0] == this.ballLocation[0] &&
      newPlayerLocation[1] == this.ballLocation[1]
    ) {
      newBallLocation = this.getNewLocation(direction, this.ballLocation);
    }

    if (
      newBallLocation[0] == this.goalLocation[0] &&
      newBallLocation[1] == this.goalLocation[1]
    ) {
      this.won = true;
    }

    this.playerLocation = newPlayerLocation;
    this.ballLocation = newBallLocation;

    this.grids = [];
    this.generateGrid();
    return this.getGrid();
  }

  getGrid() {
    return this.grids.map((a) => a.join("")).join("\n");
  }

  getRandomXY() {
    const height = this.height - 2;
    const width = this.width - 2;

    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    return [x, y];
  }

  getNewLocation(direction, thingLoc) {
    const height = this.height - 2;
    const width = this.width - 2;
    const thing = thingLoc;

    switch (direction) {
      case "up":
        if (thing[1] < 1) {
          thing[1] = height - 1;
        } else thing[1]--;
        break;
      case "down":
        if (thing[1] >= height - 1) {
          thing[1] = 0;
        } else thing[1]++;
        break;
      case "left":
        if (thing[0] < 1) {
          thing[0] = width - 1;
        } else thing[0]--;
        break;
      case "right":
        if (thing[0] >= width - 1) {
          thing[0] = 0;
        } else thing[0]++;
    }
    return thing;
  }

  shouldAddThing(currentLocation, thingLocation) {
    if (
      currentLocation[0] == thingLocation[0] + 1 &&
      currentLocation[1] == thingLocation[1] + 1
    ) {
      return true;
    } else return false;
  }
}

module.exports = {
  Soko,
};
