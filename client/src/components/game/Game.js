// General imports
import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";

import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

import { Button } from "../../views/design/Button";
import { Button2 } from "../../views/design/Button2";

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      gold: localStorage.getItem("gold"),
      health: null,
      board: null,
      canvasWidth: 1366, // 960 (Board) + 400 (Shop) + 6 (2xGap)
      canvasHeight: 764 + 6, // 704
      canBuy: false,
      wave: [],
      round: 0,
    };
  }

  async buy(coordinates) {
    console.log(coordinates);
    try {
      const requestBody = JSON.stringify({
        playable: "FireTower1",
        coordinates: coordinates,
      });
      const response = await api.post(
        "games/towers/" + localStorage.getItem("token"),
        requestBody
      );
      this.setState({ gold: response.data.gold });
      console.log("before set state " + this.state.canBuy);
      this.setState({ canBuy: true });
      console.log("after set state " + this.state.canBuy);
      console.log(localStorage.getItem("board"));
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while buying a tower: \n${handleError(
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
      this.setState({ canBuy: false });
    }
  }

  async sell(coordinates) {
    console.log(coordinates);
    try {
      const requestBody = JSON.stringify({
        coordinates: coordinates,
      });
      console.log("before sell");
      const response = await api.delete(
        "games/towers/" + localStorage.getItem("token"),
        requestBody
      );
      this.setState({ gold: response.data.gold });
      console.log(localStorage.getItem("board"));
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while buying a tower: \n${handleError(
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
      this.setState({ canBuy: false });
    }
  }

  // minion reaches the end
  async hit(dmg) {
    let newHealth = localStorage.getItem("health") - dmg;
    localStorage.setItem("health", newHealth);
    this.handleInputChange("health", newHealth);
  }

  async ImReady() {
    try {
      const response = await api.get(
        `/games/battles/${localStorage.getItem("token")}`
      );
      localStorage.setItem(
        "wave",
        JSON.stringify(response.data.player1Minions)
      );
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while getting minions: \n${handleError(
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

  async rageQuit() {
    try {
      const response = await api.delete(
        `/games/${localStorage.getItem("token")}`
      );
      this.props.history.push("/main");
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while getting minions: \n${handleError(
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

  async updateGameState(gold, health) {
    try {
      const requestBody = JSON.stringify({
        gold: gold,
        health: health,
      });
      const response = await api.patch(
        `/games/${localStorage.getItem("token")}`,
        requestBody
      );
      localStorage.setItem("continuing", response.data.continuing);
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while updating round: \n${handleError(
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
    const SHOP_WIDTH = 2 * tileGap + 400;
    const STATUS_BAR_HEIGHT = 2 * tileSize;
    const STATUS_BAR_WIDTH = BOARD_WIDTH + SHOP_WIDTH;
    let minionsInterval = 90; // spawn interval
    let frame = 0; // frame counter
    const spawnPoint = 2 * tileSize + tileGap; // y-coordinates 64, references to tile (64,64); first path tile

    const gameGrid = []; // all cells
    const pathTiles = []; // all paths
    const minions = []; // all minions
    const towers = []; // all towers
    const towerList = []; // all towers in the shop
    const projectiles = []; // all shots
    const weather = localStorage.getItem("weather");
    let round = 1;

    let spawned = false;

    var minionsToSpawn = [];
    var wave = [];
    let phase = false;

    var towerImages = [];

    const t1l1 = new Image();
    t1l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png";
    towerImages.push(t1l1);
    const t1l2 = new Image();
    t1l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png";
    towerImages.push(t1l2);
    const t1l3 = new Image();
    t1l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png";
    towerImages.push(t1l3);

    const t2l1 = new Image();
    t2l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png";
    towerImages.push(t2l1);
    const t2l2 = new Image();
    t2l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png";
    towerImages.push(t1l2);
    const t2l3 = new Image();
    t2l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png";
    towerImages.push(t2l3);

    const t3l1 = new Image();
    t3l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png";
    towerImages.push(t3l1);
    const t3l2 = new Image();
    t3l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png";
    towerImages.push(t3l2);
    const t3l3 = new Image();
    t3l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png";
    towerImages.push(t3l3);

    const t4l1 = new Image();
    t4l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png";
    towerImages.push(t4l1);
    const t4l2 = new Image();
    t4l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png";
    towerImages.push(t4l2);
    const t4l3 = new Image();
    t4l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png";
    towerImages.push(t4l3);

    const t5l1 = new Image();
    t5l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png";
    towerImages.push(t5l1);
    const t5l2 = new Image();
    t5l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png";
    towerImages.push(t5l2);
    const t5l3 = new Image();
    t5l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png";
    towerImages.push(t5l3);

    var minionImages = [];
    const m1 = new Image();
    m1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png";
    minionImages.push(m1);
    const m2 = new Image();
    m2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png";
    minionImages.push(m2);
    const m3 = new Image();
    m3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png";
    minionImages.push(m3);

    // status bar
    let score = 0;
    let HP = localStorage.getItem("health");
    let gold = localStorage.getItem("gold");
    let gameOver = false;
    let prepPhase = true;

    var towerSelector = 1;
    var TOWERS = {
      TIER1: {
        id: 1,
        towerColor: "lightgreen",
        projectileColor: "#00FF00",
        damage: 10,
        speed: 2,
        towerCost: 100,
        towerImage: towerImages[0],
      },
      TIER2: {
        id: 2,
        towerColor: "lightblue",
        projectileColor: "#099FFF",
        damage: 15,
        speed: 3,
        towerCost: 200,
        towerImage: towerImages[6],
      },
      TIER3: {
        id: 3,
        towerColor: "yellow",
        projectileColor: "#FF3300",
        damage: 20,
        speed: 0.5,
        towerCost: 400,
        towerImage: towerImages[3],
      },
      TIER4: {
        id: 4,
        towerColor: "midnightblue",
        projectileColor: "#6E0DD0",
        damage: 10,
        speed: 4,
        towerCost: 600,
        towerImage: towerImages[9],
      },
      TIER5: {
        id: 5,
        towerColor: "indigo",
        projectileColor: "#FF5F1F",
        damage: 10,
        speed: 6,
        towerCost: 1000,
        towerImage: towerImages[12],
      },
    };

    var MINIONS = {
      CRAWLER: {
        id: "Goblin",
        minionColor: "red",
        minionSize: 32,
        minionDamage: 1,
        minionSpeed: 4,
        minionHealth: 100,
        minionCost: 100,
        minionImage: minionImages[0],
      },
      RUNNER: {
        id: 2,
        minionColor: "orange",
        minionSize: 32,
        minionDamage: 1,
        minionSpeed: 5,
        minionHealth: 75,
        minionCost: 125,
        minionImage: minionImages[1],
      },
      BOSS: {
        id: "GoblinOverlord",
        minionColor: "pink",
        minionSize: 60,
        minionDamage: 5,
        minionSpeed: 3,
        minionHealth: 500,
        minionCost: 1000,
        minionImage: minionImages[2],
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
    const statusBar = {
      width: STATUS_BAR_WIDTH,
      height: STATUS_BAR_HEIGHT,
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
      if (gridPositionY < STATUS_BAR_HEIGHT) return;
      console.log("clicked");
      console.log(mouse.x + " " + mouse.y)
      var coordArray = getCoordiantes(gridPositionX, gridPositionY);
      console.log(coordArray);

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
        gridPositionY < 448 &&
        prepPhase
      ) {
        round += 1;
        this.ImReady();

        //console.log("current state:  "+ prepPhase)
        //console.log("arraylength"+ minions.length)

        wave = JSON.parse(localStorage.getItem("wave"));

        for (let i = 0; i < wave.length; i++) {
          //console.log(minionsToSpawn[i])
          switch (wave[i]) {
            case "Goblin":
              //console.log("me goblin")
              minionsToSpawn.push(
                new Minion(
                  MINIONS.CRAWLER.minionColor,
                  MINIONS.CRAWLER.minionSize,
                  MINIONS.CRAWLER.minionHealth,
                  MINIONS.CRAWLER.minionSpeed,
                  MINIONS.CRAWLER.minionDamage,
                  MINIONS.CRAWLER.minionImage
                )
              );
              break;

            case "GoblinOverlord":
              minionsToSpawn.push(
                new Minion(
                  MINIONS.BOSS.minionColor,
                  MINIONS.BOSS.minionSize,
                  MINIONS.BOSS.minionHealth,
                  MINIONS.BOSS.minionSpeed,
                  MINIONS.BOSS.minionDamage,
                  MINIONS.BOSS.minionImage
                )
              );
              break;
          }
        }
        localStorage.setItem("wave", []);
        prepPhase = false;
        return;
      }

      // clicked on different towers: set current tower
      if (
        16*tileSize <= mouse.x &&
        mouse.x < 17*tileSize &&
        2.5*tileSize <= mouse.y &&
        mouse.y < 3.5*tileSize
      ) {
        towerSelector = 1;
        sellSelector = 0;
        console.log("selected first tower");
        return;
      }

      if (
        16*tileSize <= mouse.x &&
        mouse.x < 17*tileSize &&
        4.5*tileSize <= mouse.y &&
        mouse.y < 5.5*tileSize
      ) {
        towerSelector = 2;
        sellSelector = 0;
        console.log("selected second tower");
        return;
      }

      if (
        16*tileSize <= mouse.x &&
        mouse.x < 17*tileSize &&
        6.5*tileSize <= mouse.y &&
        mouse.y < 7.5*tileSize
      ) {
        towerSelector = 3;
        sellSelector = 0;
        console.log("selected third tower");
        return;
      }
      if (
        16*tileSize <= mouse.x &&
        mouse.x < 17*tileSize &&
        8.5*tileSize <= mouse.y &&
        mouse.y < 9.5*tileSize
      ) {
        towerSelector = 4;
        sellSelector = 0;
        console.log("selected fourth tower");
        return;
      }
      if (
        16*tileSize <= mouse.x &&
        mouse.x < 17*tileSize &&
        10.5*tileSize <= mouse.y &&
        mouse.y < 11.5*tileSize
      ) {
        towerSelector = 5;
        sellSelector = 0;
        console.log("selected fifth tower");
        return;
      }

      // clicked outside of gameBoard
      if (
        gridPositionY > BOARD_HEIGHT + 2 * tileSize ||
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
            this.sell(coordArray);
            //sellSelector = 0; // BUG!!!! DO NOT USE HERE
            gold += towers[i].towerCost / 2;
            towers.splice(i, 1); // remove
            i--; // adjust for loop index
            console.log("sell");
          }
        }
      }

      if (!sellSelector) {
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

        this.buy(coordArray);
        console.log("after this.buy " + this.state.canBuy);
        if (this.state.canBuy) {
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
                  directionSelector,
                  TOWERS.TIER1.towerImage
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
                  directionSelector,
                  TOWERS.TIER2.towerImage
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
                  directionSelector,
                  TOWERS.TIER3.towerImage
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
                  directionSelector,
                  TOWERS.TIER4.towerImage
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
                  directionSelector,
                  TOWERS.TIER5.towerImage
                )
              );
              break;
          }
          //console.log("-towercost..");

          gold = this.state.gold;
          console.log(this.state.gold);
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
          ctx.strokeStyle = " ";
          ctx.strokeRect(this.x, this.y, this.width, this.height);

          // writes coordinates of tile (upper left corner)
          /*
          ctx.fillStyle = "white";
          ctx.font = "10px Arial";
          ctx.fillText("y:" + this.y + " x:" + this.x, this.x + 5, this.y + 25);
          */
        }

        ctx.strokeStyle = "dodgerblue";
        ctx.rect(this.x, this.y, this.width, this.height);
      }
    }

    function createGrid() {
      // fills gameGrid array with tile objects
      for (let y = 2 * tileSize; y < canvas.height - tileSize; y += tileSize) {
        for (let x = 0; x < canvas.width - SHOP_WIDTH; x += tileSize) {
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

        ctx.fillStyle = "silver";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // writes coordinates of tile (upper left corner) DEBUGGING
        /*
        ctx.fillStyle = "blue";
        ctx.font = "10px Arial";
        ctx.fillText("y:" + this.y + " x:" + this.x, this.x + 5, this.y + 25);
        */
      }
    }

    function createPath() {
      // fills pathTiles array with tile objects

      // 3 down
      for (let k = 2; k <= 4; k++) {
        pathTiles.push(new Path(1 * tileSize, k * tileSize));
      }

      // 12 right
      for (let k = 2; k <= 13; k++) {
        pathTiles.push(new Path(k * tileSize, 4 * tileSize));
      }

      // 2 down
      for (let k = 5; k <= 6; k++) {
        pathTiles.push(new Path(13 * tileSize, k * tileSize));
      }

      // 7 left
      for (let k = 13; k >= 6; k--) {
        pathTiles.push(new Path(k * tileSize, 6 * tileSize));
      }

      // 1 left
      for (let k = 6; k >= 5; k--) {
        pathTiles.push(new Path(k * tileSize, 7 * tileSize));
      }

      // 4 left
      for (let k = 5; k >= 1; k--) {
        pathTiles.push(new Path(k * tileSize, 8 * tileSize));
      }

      // 2 down
      for (let k = 9; k <= 10; k++) {
        pathTiles.push(new Path(1 * tileSize, k * tileSize));
      }

      // 9 left
      for (let k = 2; k <= 10; k++) {
        pathTiles.push(new Path(k * tileSize, 10 * tileSize));
      }

      // 1 down
      pathTiles.push(new Path(10 * tileSize, 11 * tileSize));
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
        direction,
        towerImage
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
        this.towerImage = towerImage;
      }

      draw() {
        ctx.fillStyle = this.towerColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.towerImage, this.x, this.y, this.width, this.height);

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
        minionDamage,
        minionImage
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
        this.minionImage = minionImage;
      }
      update() {
        // to - do code relatively
        if (this.y < 257) {
          this.y += this.movement;
        }
        if (this.y > 254.8 && this.y < 262 && this.x < 838) {
          this.x += this.movement;
        }
        if (this.y > 256 && this.y < 387 && this.x > 832.8 && this.x < 841) {
          this.y += this.movement;
        }
        if (this.y > 384.8 && this.y < 392 && this.x > 388) {
          this.x -= this.movement;
        }
        if (this.y > 384.8 && this.y < 449 && this.x > 383 && this.x < 393.2) {
          this.y += this.movement;
        }
        if (this.y > 446.8 && this.y < 454 && this.x > 326 && this.x < 393.2) {
          this.x -= this.movement;
        }
        if (this.y > 446.8 && this.y < 513 && this.x > 321 && this.x < 326) {
          this.y += this.movement;
        }
        if (this.y > 513 && this.y < 518 && this.x > 65 && this.x < 326) {
          this.x -= this.movement;
        }
        if (this.y > 513 && this.y < 641 && this.x > 60 && this.x < 72) {
          this.y += this.movement;
        }
        if (this.y > 640 && this.y < 646 && this.x > 55 && this.x < 640) {
          this.x += this.movement;
        }
        if (this.y > 640 && this.x > 639) {
          this.y += this.movement;
        }
      }
      draw() {
        ctx.save();
        ctx.fillStyle = this.minionColor;
        ctx.beginPath();
        ctx.arc(
          this.x + this.minionSize / 2,
          this.y + this.minionSize / 2,
          4 * this.minionSize,
          0,
          Math.PI * 2,
          true
        );
        ctx.closePath();
        //ctx.fill();
        ctx.clip();

        ctx.drawImage(
          this.minionImage,
          this.x,
          this.y,
          2 * this.minionSize,
          2 * this.minionSize
        );
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 25);
        ctx.restore();
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
      ctx.fillStyle = "green";
      ctx.font = "20px Orbitron";
      ctx.fillText("Gold: " + gold, 20, 55);
      ctx.fillText("Score: " + score, 220, 55);
      ctx.fillText("HP: " + HP, 420, 55);
      ctx.fillText("Current weather: " + weather, 20, 100);
      ctx.fillText(
        "Current phase:  " + (prepPhase ? "Preparation" : "Battle"),
        420,
        100
      );
      ctx.fillText("Current round:  " + round, 620, 55);
      if (sellSelector) {
        // highlight
        ctx.beginPath();

        ctx.rect(19 * tileSize, 4 * tileSize, 64, 64);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.stroke();
        ctx.closePath(); // https://stackoverflow.com/questions/9475432/html5-canvas-different-strokes/9475478
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

    var handleMinions = () => {
      const toBeDeleted = [];
      for (let i = 0; i < minions.length; i++) {
        minions[i].update();
        minions[i].draw();

        if (minions[i].health <= 0) {
          let reward = minions[i].maxHealth / 10;
          gold += reward;
          score += reward;
          // remove last minion
          toBeDeleted.push(i); // remove
          //i--; // adjust loop index
        } else if (minions[i].y > 704 && minions[i].y < 708.4) {
          HP -= minions[i].minionDamage;
          this.hit(minions[i].minionDamage);
          toBeDeleted.push(i); //remove
        }
      }
      for (let i = toBeDeleted.length - 1; i >= 0; i--) {
        console.log("deleted");
        minions.splice(toBeDeleted[i], 1);
        console.log(minions.length);
      }

      // minion spawner
      if (frame % minionsInterval === 0 && minionsToSpawn.length > 0) {
        minions.push(minionsToSpawn.pop());
      }
    };

    var handleGame = () => {
      if (phase && minions.length < 1 && !prepPhase) {
        console.log(minions.length);
        prepPhase = true;
        this.updateGameState(HP, gold);
        if (minionsInterval < 50) {
          minionsInterval -= 5;
        }
        round += 1;
      }
      if (HP < 1 && localStorage.getItem("continuing") === false) {
        gameOver = true;
      }
    };

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
      }
    }

    function handleShop() {
      // separate shop from gamebaord

      // vertical
      ctx.beginPath();
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;
      ctx.moveTo(BOARD_WIDTH + tileGap, tileSize * 2);
      ctx.lineTo(BOARD_WIDTH + tileGap, tileSize * 12);
      ctx.stroke();
      ctx.lineWidth = 1;

      // vertical
      ctx.beginPath();
      ctx.strokeStyle = "green";
      ctx.lineWidth = 5;
      ctx.moveTo(BOARD_WIDTH +  3 * tileSize, tileSize * 2);
      ctx.lineTo(BOARD_WIDTH +  3 * tileSize, tileSize * 12);
      ctx.stroke();
      ctx.lineWidth = 1;

      // horicontal
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.moveTo(0, tileSize * 2 - tileGap);
      ctx.lineTo(STATUS_BAR_WIDTH, tileSize * 2 - tileGap);
      ctx.stroke();
      ctx.lineWidth = 1;

      // horicontal
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.moveTo(tileSize * 18, tileSize * 7);
      ctx.lineTo(STATUS_BAR_WIDTH, tileSize * 7);
      ctx.stroke();
      ctx.lineWidth = 1;

      ctx.fillStyle = "green";
      ctx.font = "20px Orbitron";
      ctx.fillText("Info:", tileSize * 18.5, tileSize * 7.5);
      ctx.fillText("Cost: " + towerList[towerSelector].towerCost, tileSize * 18.5, tileSize * 8);
      ctx.fillText("Damage: " + towerList[towerSelector].damage, tileSize * 18.5, tileSize * 8.5);


      // draw towers
      for (let i = 0; i < towerList.length; i++) {
        towerList[i].draw();
      }

      ctx.beginPath();
      ctx.rect(19 * tileSize, 2 * tileSize, 64, 64);
      ctx.font = "30px Arial";
      ctx.fillStyle = "green";
      ctx.fillText("-->", 19 * tileSize + 10, 2 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(19 * tileSize, 4 * tileSize, 64, 64);
      ctx.font = "20px Arial";
      ctx.fillStyle = "green";
      ctx.fillText("SELL", 19 * tileSize + 10, 4 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(19 * tileSize, 6 * tileSize, 64, 64);
      ctx.font = "20px Arial";
      ctx.fillStyle = "green  ";
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
          2.5 * tileSize,
          TOWERS.TIER1.towerColor,
          TOWERS.TIER1.projectileColor,
          TOWERS.TIER1.damage,
          TOWERS.TIER1.speed,
          TOWERS.TIER1.towerCost,
          directionSelector,
          TOWERS.TIER1.towerImage
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          4.5 * tileSize,
          TOWERS.TIER2.towerColor,
          TOWERS.TIER2.projectileColor,
          TOWERS.TIER2.damage,
          TOWERS.TIER2.speed,
          TOWERS.TIER2.towerCost,
          directionSelector,
          TOWERS.TIER2.towerImage
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          6.5 * tileSize,
          TOWERS.TIER3.towerColor,
          TOWERS.TIER3.projectileColor,
          TOWERS.TIER3.damage,
          TOWERS.TIER3.speed,
          TOWERS.TIER3.towerCost,
          directionSelector,
          TOWERS.TIER3.towerImage
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          8.5 * tileSize,
          TOWERS.TIER4.towerColor,
          TOWERS.TIER4.projectileColor,
          TOWERS.TIER4.damage,
          TOWERS.TIER4.speed,
          TOWERS.TIER4.towerCost,
          directionSelector,
          TOWERS.TIER4.towerImage
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          10.5 * tileSize,
          TOWERS.TIER5.towerColor,
          TOWERS.TIER5.projectileColor,
          TOWERS.TIER5.damage,
          TOWERS.TIER5.speed,
          TOWERS.TIER5.towerCost,
          directionSelector,
          TOWERS.TIER5.towerImage
        )
      );
    }
    // animmation function

    function animate() {
      // create status bar
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, statusBar.width, statusBar.height);

      frame++;

      if (!gameOver) {
        requestAnimationFrame(animate);
      }

      handlePath();
      handleGameGrid();
      handleTowers();
      handleProjectiles();
      handleMinions();
      handleShop();
      handleGameStatus();
      handleGame();
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

    function getCoordiantes(gridPositionX, gridPositionY) {
      let x = (gridPositionX - tileGap) / tileSize;
      let y = (gridPositionY - tileGap - 2 * tileSize) / tileSize;
      console.log("X: " + x + " Y: " + y);
      const coordArrayforClient = [x, y];
      const coordArrayforServer = [y, x];
      return coordArrayforServer;
    }
  }

  render() {
    return (
      <div>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />

        <canvas
          ref={this.canvasRef}
          width={this.state.canvasWidth}
          height={this.state.canvasHeight}
          id={"gameboard"}
          //styles={"z-index:1"}
          style={{ backgroundColor: "black", zIndex: 1 }}
        />

        <div>
          <Button2
            onClick={() => {
              this.rageQuit();
            }}
            top={"0px"}
            left={"1300px"}
          >
            Leave Game
          </Button2>
          <Button2
            onClick={() => {
              console.log("clicked")
            }}
            top={"170px"}
            left={"1100px"}
          >
            ROTATE TOWER
          </Button2>
          
          <Button2
            onClick={() => {
              console.log("clicked")
            }}
            top={"320px"}
            left={"1000px"}
          >
            SELL
          </Button2>
        </div>
      </div>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Game);
