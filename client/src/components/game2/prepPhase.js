// General imports
import React  from "react";
import { api, handleError } from "../../helpers/api";
import { Button } from "../../views/design/Button";

import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      gold: null,
      health: null,
      board: null,
      canvasWidth: 1366, // 960
      canvasHeight: 764, // 704
      canBuy:false
    };
  }

  async buy() {
    try {
      
      /* const requestBody = JSON.stringify({
        //gold: this.state.gold,
        //gold: localStorage.getItem("gold"),
        gold: newGold,
        health: localStorage.getItem("health"),
        token: localStorage.getItem("token"),
        board: localStorage.getItem("board"),
      });
      const response = await api.patch(`/games/${localStorage.getItem("token")}`,requestBody); */

      const requestBody = JSON.stringify({
        playable: "FireTower1",
        coordinates: [0,0],
        
    });
      const response = await api.post("games/towers/"+localStorage.getItem("token"), requestBody);
      //{this.handleInputChange('gold', 8888)}
      //this.setState("gold", this.state.gold)
      this.setState({gold:response.data.gold})
      // worked
      //localStorage.setItem("gold", this.state.gold);
      //this.handleInputChange("gold", this.state.gold);

      /* localStorage.setItem("gold",newGold);
      this.handleInputChange("gold", newGold); */
      this.setState({canBuy:true})
    
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while updating gold: \n${handleError(
          error
        )}`,
        type: "warning", // 'default', 'success', 'info', 'warning'
        container: "top-left", // where to position the notifications
        animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
        dismiss: {
          duration: 4000,
        },
      });
      this.setState({canBuy:false})
    }
  }


  // minion reaches the end
  async hit(dmg) {
    try {
      let newHealth = localStorage.getItem("health") - dmg;
      const requestBody = JSON.stringify({
        //gold: this.state.gold,
        //gold: localStorage.getItem("gold"),
        gold: localStorage.getItem("gold"),
        health: newHealth,
        token: localStorage.getItem("token"),
        board: localStorage.getItem("board"),
      });
      const response = await api.patch(`/games/${localStorage.getItem("token")}`,requestBody);
      //{this.handleInputChange('gold', 8888)}
      //this.setState("gold", this.state.gold)

      // worked
      //localStorage.setItem("gold", this.state.gold);
      //this.handleInputChange("gold", this.state.gold);

      localStorage.setItem("health", newHealth);
      this.handleInputChange("health", newHealth);
    
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while updating health: \n${handleError(
          error
        )}`,
        type: "warning", // 'default', 'success', 'info', 'warning'
        container: "top-left", // where to position the notifications
        animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
        dismiss: {
          duration: 4000,
        },
      });
    }
  }



  async handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  canvasRef = React.createRef();
  componentDidMount() {
    const mouse = {
      x: 10,
      y: 10,
      width: 0.1,
      height: 0.1,
    };

    
    // canvas initialisation
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    let canvasPosition = canvas.getBoundingClientRect();

    // global variable
    const tileSize = 64;
    const tileGap = 3;
    const BOARD_WIDTH = 960; // 15 * 64
    const BOARD_HEIGHT = 640; // 10 * 64
    let minionsInterval = 600; // spawn interval
    let frame = 0; // frame counter
    const spawnPoint = 1 * tileSize + tileGap; // y-coordinates 64, references to tile (64,64); first path tile

    const gameGrid = []; // all cells
    const pathTiles = []; // all paths
    const minions = []; // all minions
    const towers = []; // all towers
    const towerList = []; // all towers in the shop
    const projectiles = []; // all shots

    let spawned = false;
    const wave = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3]; // example of a back-end spawn list

    let ready = false;

    // status bar
    let score = 0;
    let HP = 100000;
    let gold = 30000;
    let gameOver = false;
    const statusBarHeight = 112; // fix

    var towerSelector = "";
    var TOWERS = {
      TIER1: {
        id: 1,
        towerColor: "yellow",
        projectileColor: "black",
        damage: 10,
        speed: 2,
        towerCost: 100,
      },
      TIER2: {
        id: 2,
        towerColor: "orange",
        projectileColor: "black",
        damage: 15,
        speed: 3,
        towerCost: 200,
      },
      TIER3: {
        id: 3,
        towerColor: "red",
        projectileColor: "orange",
        damage: 20,
        speed: 0.5,
        towerCost: 400,
      },
      TIER4: {
        id: 4,
        towerColor: "green",
        projectileColor: "blue",
        damage: 10,
        speed: 4,
        towerCost: 600,
      },
      TIER5: {
        id: 5,
        towerColor: "purple",
        projectileColor: "green",
        damage: 10,
        speed: 6,
        towerCost: 1000,
      },
    };

    var MINIONS = {
      CRAWLER: {
        id: 1,
        minionColor: "red",
        minionSize: 32,
        minionDamage: 10,
        minionSpeed: 4,
        minionHealth: 100,
        minionCost: 100,
      },
      RUNNER: {
        id: 2,
        minionColor: "orange",
        minionSize: 32,
        minionDamage: 5,
        minionSpeed: 5,
        minionHealth: 75,
        minionCost: 125,
      },
      BOSS: {
        id: 3,
        minionColor: "pink",
        minionSize: 60,
        minionDamage: 50,
        minionSpeed: 3,
        minionHealth: 500,
        minionCost: 1000,
      },
    };

    var directionSelector = 1;
    var PROJECTILE_DIRECTIONS = {
      UP: { id: 0 },
      RIGHT: { id: 1 },
      DOWN: { id: 2 },
      LEFT: { id: 3 },
    };

    var sellSelector = 1;

    // game board
    const controlsBar = {
      width: canvas.width, // board width
      height: tileSize,
    };

    // EventListeners

    // fixed bug when resizing
    window.addEventListener("resize", function () {
      canvasPosition = canvas.getBoundingClientRect();
    });

    // get mouse position
    canvas.addEventListener("mousemove", function (e) {
      mouse.x = e.x - canvasPosition.left;
      mouse.y = e.y - canvasPosition.top;
    });

    // set mouse position for undefined
    canvas.addEventListener("mouseleave", function () {
      mouse.x = undefined;
      mouse.y = undefined;
    });

    canvas.addEventListener("click", () => {
      // get mouse position
      const gridPositionX = mouse.x - (mouse.x % tileSize) + tileGap;
      const gridPositionY = mouse.y - (mouse.y % tileSize) + tileGap;

      // clicked on statusbar: do nothing
      if (gridPositionY < tileSize) return;
      console.log("helo");

      // clicked on change directory: change directory
      if (
        1216 <= gridPositionX &&
        gridPositionX < 1280 &&
        128 <= gridPositionY &&
        gridPositionY < 192
      ) {
        directionSelector = (directionSelector + 1) % 4;
        console.log("changed directory " + directionSelector);
        return;
      }

      // clicked on sell: change sellSelector
      if (
        1216 <= gridPositionX &&
        gridPositionX < 1280 &&
        256 <= gridPositionY &&
        gridPositionY < 320
      ) {
        sellSelector = (sellSelector + 1) % 2;
        console.log("selected sell selector " + sellSelector);
        return;
      }

      // clicked on sell: change sellSelector
      if (
        1216 <= gridPositionX &&
        gridPositionX < 1280 &&
        384 <= gridPositionY &&
        gridPositionY < 448
      ) {
        ready = true;
        console.log("is ready? " + ready);
        return;
      }

      // clicked on different towers: set current tower
      if (
        1000 <= gridPositionX &&
        gridPositionX < 1064 &&
        128 <= gridPositionY &&
        gridPositionY < 192
      ) {
        towerSelector = 1;
        sellSelector = 0;
        console.log("selected first tower");
        return;
      }

      if (
        1000 <= gridPositionX &&
        gridPositionX < 1064 &&
        256 <= gridPositionY &&
        gridPositionY < 320
      ) {
        towerSelector = 2;
        sellSelector = 0;
        console.log("selected second tower");
        return;
      }

      if (
        1000 <= gridPositionX &&
        gridPositionX < 1064 &&
        384 <= gridPositionY &&
        gridPositionY < 448
      ) {
        towerSelector = 3;
        sellSelector = 0;
        console.log("selected third tower");
        return;
      }
      if (
        1000 <= gridPositionX &&
        gridPositionX < 1064 &&
        512 <= gridPositionY &&
        gridPositionY < 576
      ) {
        towerSelector = 4;
        sellSelector = 0;
        console.log("selected fourth tower");
        return;
      }
      if (
        1000 <= gridPositionX &&
        gridPositionX < 1064 &&
        640 <= gridPositionY &&
        gridPositionY < 704
      ) {
        towerSelector = 5;
        sellSelector = 0;
        console.log("selected fifth tower");
        return;
      }

      // clicked outside of gameBoard
      if (
        gridPositionY > BOARD_HEIGHT + tileSize ||
        gridPositionX > BOARD_WIDTH
      )
        return;

      // check if we clicked on path
      for (let i = 0; i < pathTiles.length; i++) {
        //console.log(pathTiles[i].x + "   " + gridPositionX)
        if (
          pathTiles[i].x + tileGap == gridPositionX &&
          pathTiles[i].y + tileGap == gridPositionY
        ) {
          return;
        }
      }

      // check if there is already a Tower
      for (let i = 0; i < towers.length; i++) {
        if (towers[i].x == gridPositionX && towers[i].y == gridPositionY) {
          if (!sellSelector) {
            return;
          } else {
            //sellSelector = 0; // BUG!!!! DO NOT USE HERE
            gold += towers[i].towerCost / 2;
            towers.splice(i, 1); // remove
            i--; // adjust for loop index
            console.log("sell");
          }
        }
      }

      if (!sellSelector) {
        //let towerCost = 100;
        let towerCost;
        switch (towerSelector) {
          case 1:
            towerCost = TOWERS.TIER1.towerCost;
            break;
          case 2:
            towerCost = TOWERS.TIER2.towerCost;
            break;
          case 3:
            towerCost = TOWERS.TIER3.towerCost;
            break;
          case 4:
            towerCost = TOWERS.TIER4.towerCost;
            break;
          case 5:
            towerCost = TOWERS.TIER5.towerCost;
            break;
        }
        this.buy();
        if (this.state.canBuy){
          // to to Check selected tower variable
          //towers.push(new Tower(gridPositionX, gridPositionY, 'blue', 'yellow', 500, 200, 100));
          switch (towerSelector) {
            case 1:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.TIER1.towerColor,
                  TOWERS.TIER1.projectileColor,
                  TOWERS.TIER1.damage,
                  TOWERS.TIER1.speed,
                  TOWERS.TIER1.towerCost,
                  directionSelector
                )
              );
              break;
            case 2:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.TIER2.towerColor,
                  TOWERS.TIER2.projectileColor,
                  TOWERS.TIER2.damage,
                  TOWERS.TIER2.speed,
                  TOWERS.TIER2.towerCost,
                  directionSelector
                )
              );
              break;
            case 3:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.TIER3.towerColor,
                  TOWERS.TIER3.projectileColor,
                  TOWERS.TIER3.damage,
                  TOWERS.TIER3.speed,
                  TOWERS.TIER3.towerCost,
                  directionSelector
                )
              );
              break;
            case 4:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.TIER4.towerColor,
                  TOWERS.TIER4.projectileColor,
                  TOWERS.TIER4.damage,
                  TOWERS.TIER4.speed,
                  TOWERS.TIER4.towerCost,
                  directionSelector
                )
              );
              break;
            case 5:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.TIER5.towerColor,
                  TOWERS.TIER5.projectileColor,
                  TOWERS.TIER5.damage,
                  TOWERS.TIER5.speed,
                  TOWERS.TIER5.towerCost,
                  directionSelector
                )
              );
              break;
          }
          console.log("-towercost..");
        
          gold -= towerCost;
        }
      }
    });

    // ENTITIES

    class Tile {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = tileSize;
        this.height = tileSize;
      }
      draw() {
        // todo: color empty tiles

        if (collision(this, mouse)) {
          // highlights current tile
          ctx.strokeStyle = "black";
          ctx.strokeRect(this.x, this.y, this.width, this.height);

          // writes coordinates of tile (upper left corner)
          ctx.fillStyle = "blue";
          ctx.font = "10px Arial";
          ctx.fillText("y:" + this.y + " x:" + this.x, this.x + 5, this.y + 25);
        }
      }
    }

    function createGrid() {
      // fills gameGrid array with tile objects
      for (let y = tileSize; y < canvas.height - 64; y += tileSize) {
        for (let x = 0; x < canvas.width - 406; x += tileSize) {
          gameGrid.push(new Tile(x, y));
        }
      }
    }

    class Path {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = tileSize;
        this.height = tileSize;
      }

      draw() {
        // todo: style path

        // highlights current tile
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // writes coordinates of tile (upper left corner)
        ctx.fillStyle = "blue";
        ctx.font = "10px Arial";
        ctx.fillText("y:" + this.y + " x:" + this.x, this.x + 5, this.y + 25);
      }
    }

    function createPath() {
      // fills pathTiles array with tile objects

      // 3 down
      for (let k = 1; k <= 3; k++) {
        pathTiles.push(new Path(1 * tileSize, k * tileSize));
      }

      // 12 right
      for (let k = 2; k <= 13; k++) {
        pathTiles.push(new Path(k * tileSize, 3 * tileSize));
      }

      // 2 down
      for (let k = 4; k <= 5; k++) {
        pathTiles.push(new Path(13 * tileSize, k * tileSize));
      }

      // 7 left
      for (let k = 13; k >= 6; k--) {
        pathTiles.push(new Path(k * tileSize, 5 * tileSize));
      }

      // 1 left
      for (let k = 6; k >= 5; k--) {
        pathTiles.push(new Path(k * tileSize, 6 * tileSize));
      }

      // 4 left
      for (let k = 5; k >= 1; k--) {
        pathTiles.push(new Path(k * tileSize, 7 * tileSize));
      }

      // 2 down
      for (let k = 8; k <= 9; k++) {
        pathTiles.push(new Path(1 * tileSize, k * tileSize));
      }

      // 9 left
      for (let k = 2; k <= 10; k++) {
        pathTiles.push(new Path(k * tileSize, 9 * tileSize));
      }

      // 1 down
      pathTiles.push(new Path(10 * tileSize, 10 * tileSize));
    }

    class Tower {
      constructor(
        x,
        y,
        towerColor,
        projectileColor,
        damage,
        speed,
        towerCost,
        direction
      ) {
        // 2dim. array attribute
        this.x = x;
        this.y = y;
        this.width = tileSize - tileGap * 2;
        this.height = tileSize - tileGap * 2; // prevents from collisions from the edges
        this.shooting = true;
        this.projectiles = [];
        this.timer = 0;
        this.towerColor = towerColor;
        this.projectileColor = projectileColor;
        this.damage = damage;
        this.speed = speed;
        this.towerCost = towerCost;
        this.direction = direction;
      }

      draw() {
        // todo: style tower

        // draw tower entity
        ctx.fillStyle = this.towerColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // draw damage
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(this.damage, this.x + 15, this.y + 30);
      }

      update() {
        this.timer++;
        if (this.timer % 100 === 0) {
          projectiles.push(
            new Projectiles(
              this.x + 30,
              this.y + 30,
              this.damage,
              this.projectileColor,
              this.speed,
              this.direction
            )
          );

          //var audio = new Audio('https://opengameart.org/sites/default/files/Laser%20Shot.mp3');
          //audio.play();
        }
      }
    }

    class Minion {
      constructor(
        minionColor,
        minionSize,
        minionHealth,
        minionSpeed,
        minionDamage
      ) {
        // minionSize, minionColor, minionDamage, minionHP, minionSpeed, minionCost
        //this.x = canvas.width;
        //this.y = verticalPosition;
        this.x = tileSize; // spawn point
        this.y = spawnPoint; // spawn point
        this.width = tileSize - tileGap * 2;
        this.height = tileSize - tileGap * 2;
        this.minionSize = minionSize;
        this.speed = minionSpeed;
        this.movement = this.speed;
        this.health = minionHealth;
        this.maxHealth = this.health;
        this.minionColor = minionColor;
        this.minionDamage = minionDamage;
      }
      update() {
        // to - do code relatively
        if (this.y < 193) {
          this.y += this.movement;
        }
        if (this.y > 190.8 && this.y < 198 && this.x < 838) {
          this.x += this.movement;
        }
        if (this.y > 193 && this.y < 323 && this.x > 832.8 && this.x < 841) {
          this.y += this.movement;
        }
        if (this.y > 320.8 && this.y < 328 && this.x > 388) {
          this.x -= this.movement;
        }
        if (this.y > 320.8 && this.y < 385 && this.x > 383 && this.x < 393.2) {
          this.y += this.movement;
        }
        if (this.y > 382.8 && this.y < 390 && this.x > 326 && this.x < 393.2) {
          this.x -= this.movement;
        }
        if (this.y > 382.8 && this.y < 449 && this.x > 321 && this.x < 326) {
          this.y += this.movement;
        }
        if (this.y > 449 && this.y < 454 && this.x > 65 && this.x < 326) {
          this.x -= this.movement;
        }
        if (this.y > 449 && this.y < 577 && this.x > 60 && this.x < 72) {
          this.y += this.movement;
        }
        if (this.y > 576 && this.y < 582 && this.x > 55 && this.x < 640) {
          this.x += this.movement;
        }
        if (this.y > 576 && this.x > 639) {
          this.y += this.movement;
        }
      }
      draw() {
        ctx.fillStyle = this.minionColor;
        ctx.beginPath();
        ctx.arc(
          this.x + this.minionSize / 2,
          this.y + this.minionSize / 2,
          this.minionSize / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 25);
      }
    }

    class Projectiles {
      constructor(x, y, damage, projectileColor, speed, direction) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.damage = damage;
        this.speed = speed;
        this.projectileColor = projectileColor;
        this.direction = direction;
      }

      update() {
        switch (this.direction) {
          case 0:
            this.y += this.speed;
            break;
          case 1:
            this.x += this.speed;
            break;
          case 2:
            this.y -= this.speed;
            break;
          case 3:
            this.x -= this.speed;
            break;
        }
      }

      draw() {
        ctx.fillStyle = this.projectileColor;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // handlers

    function handleGameStatus() {
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.fillText("Gold: " + gold, 20, 55);
      ctx.fillText("Score: " + score, 220, 55);
      ctx.fillText("HP: " + HP, 420, 55);

      if (sellSelector) {
        // highlight
        ctx.beginPath();

        ctx.rect(19 * tileSize, 4 * tileSize, 64, 64);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.closePath(); // https://stackoverflow.com/questions/9475432/html5-canvas-different-strokes/9475478
      }
      if(!minions){
        this.props.history.push(`/login`);
      }
      if (gameOver) {
        // defeat screen
        ctx.beginPath();
        ctx.rect(0, 64, 960, 640);
        ctx.lineWidth = "3";
        ctx.strokeStyle = "red";
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "red";
        ctx.font = "150px Arial";
        ctx.fillText("Gameover", 50, 350);
        ctx.font = "80px Arial";
        ctx.fillText("you have been defeated... ", 45, 450);
        ctx.fillText("Score: " + score, 200, 550);
      }
    }

    function handleGameGrid() {
      for (let i = 0; i < gameGrid.length; i++) {
        gameGrid[i].draw();
      }
    }

    function handlePath() {
      for (let i = 0; i < pathTiles.length; i++) {
        pathTiles[i].draw();
      }
    }

    function handleTowers() {
      for (let i = 0; i < towers.length; i++) {
        towers[i].draw();
        towers[i].update();
      }
    }

    function spawnWave(wave) {
      for (let i = 0; i < wave.length; i++) {
        if (frame % minionsInterval === 0) {
          switch (wave[i]) {
            case 1:
              minions.push(
                new Minion(
                  MINIONS.CRAWLER.minionColor,
                  MINIONS.CRAWLER.minionSize,
                  MINIONS.CRAWLER.minionHealth,
                  MINIONS.CRAWLER.minionSpeed,
                  MINIONS.CRAWLER.minionDamage
                )
              );
              break;

            case 2:
              minions.push(
                new Minion(
                  MINIONS.RUNNER.minionColor,
                  MINIONS.RUNNER.minionSize,
                  MINIONS.RUNNER.minionHealth,
                  MINIONS.RUNNER.minionSpeed,
                  MINIONS.RUNNER.minionDamage
                )
              );
              break;

            case 3:
              minions.push(
                new Minion(
                  MINIONS.BOSS.minionColor,
                  MINIONS.BOSS.minionSize,
                  MINIONS.BOSS.minionHealth,
                  MINIONS.BOSS.minionSpeed,
                  MINIONS.BOSS.minionDamage
                )
              );
              break;
          }
        }
      }
      console.log("spawned");
      spawned = true;
    }

    var handleMinions =() => {
      for (let i = 0; i < minions.length; i++) {
        minions[i].update();
        minions[i].draw();
        if (minions[i].y > 704 && minions[i].y < 708.4) {
          //if (minions[i].y > 704 && minions[i].y < 708.4) {
          HP -= minions[i].minionDamage;
          this.hit(minions[i].minionDamage);
          if (HP <= 0) {
            // remove last minion
            minions.splice(i, 1); // remove
            i--; // adjust loop index
            gameOver = true;
          }
        }
        if (minions[i].health <= 0) {
          let reward = minions[i].maxHealth / 10;
          gold += reward;
          score += reward;
          // remove last minion
          minions.splice(i, 1); // remove
          i--; // adjust loop index
        }
      }

      // minion spawner
    }

    function handleProjectiles() {
      for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < minions.length; j++) {
          if (
            minions[j] &&
            projectiles[i] &&
            collision(projectiles[i], minions[j])
          ) {
            // both existing and is hit?
            minions[j].health -= projectiles[i].damage;
            projectiles.splice(i, 1); // remove
            i--; // adjust for loop index
          }
        }

        if (projectiles[i] && projectiles[i].x > BOARD_WIDTH) {
          projectiles.splice(i, 1); // remove
          i--; // adjust for loop index
        }
        //console.log('projectiles ' + projectiles.length);
      }
    }

    function handleShop() {
      // separate shop from gamebaord
      ctx.fillStyle = "black";
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.moveTo(BOARD_WIDTH + 2 * tileGap, tileSize);
      ctx.lineTo(BOARD_WIDTH + 2 * tileGap, tileSize * 11);
      ctx.stroke();
      ctx.lineWidth = 1;

      // draw towers
      for (let i = 0; i < towerList.length; i++) {
        towerList[i].draw();
      }

      ctx.beginPath();
      ctx.rect(19 * tileSize, 2 * tileSize, 64, 64);
      ctx.font = "30px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("-->", 19 * tileSize + 10, 2 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(19 * tileSize, 4 * tileSize, 64, 64);
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("SELL", 19 * tileSize + 10, 4 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(19 * tileSize, 6 * tileSize, 64, 64);
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText("Ready", 19 * tileSize + 10, 6 * tileSize + 38);
      ctx.stroke();
    }

    function createShop() {
      // to do: fill automatically
      for (let k = 1; k <= 3; k++) {
        for (let j = 1; j <= 2; j++) {}
      }
      towerList.push(
        new Tower(
          16 * tileSize,
          2 * tileSize,
          TOWERS.TIER1.towerColor,
          TOWERS.TIER1.projectileColor,
          TOWERS.TIER1.damage,
          TOWERS.TIER1.speed,
          TOWERS.TIER1.towerCost,
          directionSelector
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          4 * tileSize,
          TOWERS.TIER2.towerColor,
          TOWERS.TIER2.projectileColor,
          TOWERS.TIER2.damage,
          TOWERS.TIER2.speed,
          TOWERS.TIER2.towerCost,
          directionSelector
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          6 * tileSize,
          TOWERS.TIER3.towerColor,
          TOWERS.TIER3.projectileColor,
          TOWERS.TIER3.damage,
          TOWERS.TIER3.speed,
          TOWERS.TIER3.towerCost,
          directionSelector
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          8 * tileSize,
          TOWERS.TIER4.towerColor,
          TOWERS.TIER4.projectileColor,
          TOWERS.TIER4.damage,
          TOWERS.TIER4.speed,
          TOWERS.TIER4.towerCost,
          directionSelector
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          10 * tileSize,
          TOWERS.TIER5.towerColor,
          TOWERS.TIER5.projectileColor,
          TOWERS.TIER5.damage,
          TOWERS.TIER5.speed,
          TOWERS.TIER5.towerCost,
          directionSelector
        )
      );
    }

    // animmation function

    function animate() {
      // create control bar
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "blue";
      ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);

      frame++;

      //console.log(frame);

      if (!gameOver) {
        requestAnimationFrame(animate);
      }

      handleGameGrid();
      handlePath();
      handleTowers();
      handleProjectiles();
      handleMinions();
      handleShop();
      handleGameStatus();
    }

    // actual sequence

    createGrid();
    createPath();
    createShop();
    animate();

    // Helper functions

    function collision(first, second) {
      if (
        !(
          first.x > second.x + second.width ||
          first.x + first.width < second.x ||
          first.y > second.y + second.height ||
          first.y + first.height < second.y
        )
      ) {
        return true;
      }
    }
  }

  render() {
    return (
      <div>
        <div>
          {/* {gID} - {gold} - {this.state.gold} - {userId} - {token} - {health} - {board} */}
          {localStorage.getItem("gold")}
        </div>

        <div>
          <Button
            onClick={() => {
              this.buy();
            }}
          ></Button>
          <input
            onChange={(e) => {
              this.handleInputChange("gold", e.target.value);
            }}
          />
        </div>
        <canvas
          ref={this.canvasRef}
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          id={"gameboard"}
        />
      </div>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Game;
