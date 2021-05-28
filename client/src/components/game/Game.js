// General imports
import React from "react";
import { api, handleError } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      health: null,
      board: null,
      canvasWidth: 1366, // 960 (Board) + 400 (Shop) + 6 (2xGap)
      canvasHeight: 764 + 6, // 704
      wave: [],
      round: 0,
    };
  }

  async buy(coordinates,towerType) {
    try {
      const requestBody = JSON.stringify({
        playable: towerType,
        coordinates: coordinates,
      });
      await api.post("games/towers/" + localStorage.getItem("token"),requestBody);

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
          duration: 3000,
        },
      });

    }
  }

  async upgrade(coordinates) {
    try {
      const requestBody = JSON.stringify({
        coordinates: coordinates,
      });
      await api.patch("games/towers/" + localStorage.getItem("token"),requestBody);

    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while upgrading a tower: \n${handleError(
          error
        )}`,
        type: "warning", // 'default', 'success', 'info', 'warning'
        container: "top-left", // where to position the notifications
        animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
        animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
        dismiss: {
          duration: 3000,
        },
      });

    }
  }

  async sell(coordinates) {
    try {
      const requestBody = JSON.stringify({
        coordinates: coordinates,
      });

      const response = await api.patch(
        "games/towers/sales/" + localStorage.getItem("token"),
        requestBody
      );
      this.setState({ gold: response.data.gold });

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
          duration: 3000,
        },
      });

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
      const response = await api.get(`/games/battles/${localStorage.getItem("token")}`);
      localStorage.setItem("wave", JSON.stringify(response.data.player1Minions));

      const response2 = await api.get('/games/'+localStorage.getItem("gameId"));
      localStorage.setItem("gold", response2.data.player1.gold);
      localStorage.setItem("health", response2.data.player1.health);
      localStorage.setItem("board", response2.data.player1.board);
      this.setState({gold: localStorage.getItem("gold")});

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

      localStorage.removeItem("gold")
      localStorage.removeItem("gameId")
      localStorage.removeItem("health")
      localStorage.removeItem("board")
      localStorage.removeItem("wave")
      localStorage.removeItem("continuing")
      localStorage.removeItem("weather")
      this.props.history.push("/main");
      await api.delete(
              `/games/${localStorage.getItem("token")}`
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
          duration: 3000,
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
      const response = await api.patch(`/games/${localStorage.getItem("token")}`,requestBody);

      const response2 = await api.get('/games/'+localStorage.getItem("gameId"));
      localStorage.setItem("gold", response2.data.player1.gold);
      this.setState({gold: localStorage.getItem("gold")});

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
          duration: 3000,
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

    const statusBar = {
      width: STATUS_BAR_WIDTH,
      height: STATUS_BAR_HEIGHT,
    };

    // Array for Game Objects
    const gameGrid = []; // all cells
    const pathTiles = []; // all paths
    const minions = []; // all minions
    const towers = []; // all towers
    const towerList = []; // all towers in the shop
    const projectiles = []; // all shots


    var minionsToSpawn = [];
    var wave = [];
    let phase = false;
    let collectPhase = false;
    let towerCost = 0;
    let buyCheck = false;
    let towerType = null;
    const weather = localStorage.getItem("weather");
    let round = 1;

    // status bar
    let score = 0;
    let HP = localStorage.getItem("health");
    let gold = localStorage.getItem("gold");
    let gameOver = false;
    let prepPhase = true;
    
    // SELECTORS
    var upgradeSelctor = 0;
    var towerSelector = 0;
    var directionSelector = 1;
    var sellSelector = 1;


    // MEDIA - ASSETS
    var towerImages = [];
    var minionImages = [];
    var sounds = [];

    // TOWERS
    const t1l1 = new Image();
    t1l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png"; // Bisasam 0
    towerImages.push(t1l1);
    const t1l2 = new Image();
    t1l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png"; // Bisaknosp 1
    towerImages.push(t1l2);
    const t1l3 = new Image();
    t1l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png"; // Bisaflor 2
    towerImages.push(t1l3);

    const t2l1 = new Image();
    t2l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png"; // GLumanda 3
    towerImages.push(t2l1);
    const t2l2 = new Image();
    t2l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png"; // Glutexo 4
    towerImages.push(t2l2);
    const t2l3 = new Image();
    t2l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png"; // Glurak 5
    towerImages.push(t2l3);

    const t3l1 = new Image();
    t3l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png"; // Schiggy 6
    towerImages.push(t3l1);
    const t3l2 = new Image();
    t3l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/8.png"; // Schillok 7
    towerImages.push(t3l2);
    const t3l3 = new Image();
    t3l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png"; // Turtok 8
    towerImages.push(t3l3);

    const t4l1 = new Image();
    t4l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png"; // Abra 9
    towerImages.push(t4l1);
    const t4l2 = new Image();
    t4l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/64.png"; // Kadabra 10
    towerImages.push(t4l2);
    const t4l3 = new Image();
    t4l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png"; // Simsala 11
    towerImages.push(t4l3);

    const t5l1 = new Image();
    t5l1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png"; // Dratini 12
    towerImages.push(t5l1);
    const t5l2 = new Image();
    t5l2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/148.png"; // Dragonir 13
    towerImages.push(t5l2);
    const t5l3 = new Image();
    t5l3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png"; // Dragoran 14
    towerImages.push(t5l3);


    // MINIONS
    const m1 = new Image();
    m1.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png"; // Karpador
    minionImages.push(m1);
    const m2 = new Image();
    m2.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png"; // Gengar
    minionImages.push(m2);
    const m3 = new Image();
    m3.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png"; // Garados
    minionImages.push(m3);
    const m4 = new Image();
    m4.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png"; // Nebulak
    minionImages.push(m4);
    const m5 = new Image();
    m5.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png"; // Zapdos
    minionImages.push(m5);
    const m6 = new Image();
    m6.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png"; // Lavados
    minionImages.push(m6);
    const m7 = new Image();
    m7.src =
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png"; // Arktos
    minionImages.push(m7);


    // SOUNDS
    var damage1 = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_damage_hit1.mp3?raw=true'); // don't forget raw=true!
    sounds.push(damage1);
    var click1 = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_menu_move3.mp3?raw=true'); // don't forget raw=true!
    sounds.push(click1);
    var upgradeTower1 = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_sounds_powerup5.mp3?raw=true'); // don't forget raw=true!
    sounds.push(upgradeTower1);
    var lost = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_sound_shutdown2.mp3?raw=true'); // don't forget raw=true!
    sounds.push(lost);
    var sellTower = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_coin_double3.mp3?raw=true'); // don't forget raw=true!
    sounds.push(sellTower);
    var earnMinionGold = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_coin_cluster3.mp3?raw=true'); // don't forget raw=true!
    sounds.push(earnMinionGold);
    var waveStarts = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_alarm_loop3.mp3?raw=true');
    sounds.push(waveStarts);
    var upgradeTower1 = new Audio('https://github.com/sopra-fs21-group-10/td-client/blob/master/src/assets/sounds/sfx_sounds_fanfare1.mp3?raw=true'); // don't forget raw=true!
    sounds.push(upgradeTower1);

// weather
    const thunderstorm = new Image();
    thunderstorm.src =
    "https://raw.githubusercontent.com/sopra-fs21-group-10/td-client/master/src/assets/img/thunderstorm.png";
    
    const cloudy = new Image();
    cloudy.src =
    "https://raw.githubusercontent.com/sopra-fs21-group-10/td-client/master/src/assets/img/cloudy.png";
    
    const cloudyAndSun = new Image();
    cloudyAndSun.src =
    "https://raw.githubusercontent.com/sopra-fs21-group-10/td-client/master/src/assets/img/cloudyAndSun.png";
    
    const rainy = new Image();
    rainy.src =
    "https://raw.githubusercontent.com/sopra-fs21-group-10/td-client/master/src/assets/img/rainy.png";
    
    const snowy = new Image();
    snowy.src =
    "https://raw.githubusercontent.com/sopra-fs21-group-10/td-client/master/src/assets/img/snowy.png";
    
    const sunny = new Image();
    sunny.src =
    "https://raw.githubusercontent.com/sopra-fs21-group-10/td-client/master/src/assets/img/sunny.png";
    
    const windy = new Image();
    windy.src =
    "https://raw.githubusercontent.com/sopra-fs21-group-10/td-client/master/src/assets/img/windy.png";
    
    
    
    

    // ATTRIBUTES
    var TOWERS = {
    //classic tower: normal damage cheap
      PLANT: {
        id: 1,
        towerColor: "lightgreen",
        projectileColor: "#00FF00",
        damage: 25,
        speed: 5,
        towerCost: 100,
        towerImage: towerImages[0],
        attackSpeed: 80
      },
      // aoe tower
      WATER: {
        id: 2,
        towerColor: "lightblue",
        projectileColor: "#099FFF",
        damage: 5,
        speed: 4,
        towerCost: 200,
        towerImage: towerImages[6],
        attackSpeed: 15
      },
      //lazor tower
      FIRE: {
        id: 3,
        towerColor: "yellow",
        projectileColor: "#FF3300",
        damage: 1,
        speed: 20,
        towerCost: 300,
        towerImage: towerImages[3],
        attackSpeed: 2
      },
      //allrounder/slow shots
      PSYCH: {
        id: 4,
        towerColor: "midnightblue",
        projectileColor: "#6E0DD0",
        damage: 40,
        speed: 2,
        towerCost: 400,
        towerImage: towerImages[9],
        attackSpeed: 40
      },
      //oneshot
      DRAGON: {
        id: 5,
        towerColor: "indigo",
        projectileColor: "#FF5F1F",
        damage: 300,
        speed: 4,
        towerCost: 1000,
        towerImage: towerImages[12],
        attackSpeed: 60
      },
    };

    var TOWERS2 = {
      //classic tower: normal damage cheap
        PLANT: {
          id: 6,
          towerColor: "green",
          projectileColor: "#00FF00",
          damage: 50,
          speed: 5,
          towerCost: 300,
          towerImage: towerImages[1],
          attackSpeed: 90
        },
        // double everything? double the fun! actually don't buy this; you know why the 1st tower is better
        WATER: {
          id: 7,
          towerColor: "lightblue",
          projectileColor: "#099FFF",
          damage: 10,
          speed: 4,
          towerCost: 400,
          towerImage: towerImages[7],
          attackSpeed: 13
        },
        //lazor tower
        FIRE: {
          id: 8,
          towerColor: "yellow",
          projectileColor: "#FF3300",
          damage: 3,
          speed: 20,
          towerCost: 600,
          towerImage: towerImages[4],
          attackSpeed: 2
        },
        //not implemented
        PSYCH: {
          id: 9,
          towerColor: "midnightblue",
          projectileColor: "#6E0DD0",
          damage: 90,
          speed: 2,
          towerCost: 1000,
          towerImage: towerImages[10],
          attackSpeed: 40
        },
        //oneshot
        DRAGON: {
          id: 10,
          towerColor: "indigo",
          projectileColor: "#FF5F1F",
          damage: 750,
          speed: 4,
          towerCost: 2500,
          towerImage: towerImages[13],
          attackSpeed: 50
        },
      };

      var TOWERS3 = {
        //classic tower: normal damage cheap
          PLANT: {
            id: 11,
            towerColor: "green",
            projectileColor: "#00FF00",
            damage: 100,
            speed: 5,
            towerCost: 500,
            towerImage: towerImages[2],
            attackSpeed: 100
          },
          // double everything? double the fun! actually don't buy this; you know why the 1st tower is better
          WATER: {
            id: 12,
            towerColor: "blue",
            projectileColor: "#099FFF",
            damage: 20,
            speed: 4,
            towerCost: 1000,
            towerImage: towerImages[8],
            attackSpeed: 11
          },
          //lazor tower
          FIRE: {
            id: 13,
            towerColor: "red",
            projectileColor: "#FF3300",
            damage: 4,
            speed: 20,
            towerCost: 1500,
            towerImage: towerImages[5],
            attackSpeed: 1
          },
          //not implemented
          PSYCH: {
            id: 14,
            towerColor: "midnightblue",
            projectileColor: "#6E0DD0",
            damage: 175,
            speed: 2,
            towerCost: 5000,
            towerImage: towerImages[11],
            attackSpeed: 30
          },
          //oneshot
          DRAGON: {
            id: 15,
            towerColor: "indigo",
            projectileColor: "#FF5F1F",
            damage: 1500,
            speed: 4,
            towerCost: 10000,
            towerImage: towerImages[14],
            attackSpeed: 30
          },
        };

    var MINIONS = {
      Karpador: {
        id: "Karpador",
        minionColor: "red",
        minionSize: 32,
        minionDamage: 1,
        minionSpeed: 4,
        minionHealth: 100,
        minionCost: 100,
        minionImage: minionImages[0],
      },
      Nebulak: {
        id: "Nebulak",
        minionColor: "orange",
        minionSize: 32,
        minionDamage: 1,
        minionSpeed: 5,
        minionHealth: 175,
        minionCost: 125,
        minionImage: minionImages[3],
      },
      Gengar: {
        id: "Gengar",
        minionColor: "pink",
        minionSize: 32,
        minionDamage: 2,
        minionSpeed: 5,
        minionHealth: 300,
        minionCost: 225,
        minionImage: minionImages[1],
      },
      Garados: {
        id: "Garados",
        minionColor: "pink",
        minionSize: 60,
        minionDamage: 8,
        minionSpeed: 3,
        minionHealth: 1000,
        minionCost: 1000,
        minionImage: minionImages[2],
      },
      Zapdos: {
        id: "Zapdos",
        minionColor: "pink",
        minionSize: 48,
        minionDamage: 10,
        minionSpeed: 6,
        minionHealth: 2500,
        minionCost: 1000,
        minionImage: minionImages[4],
      },
      Lavados: {
        id: "Lavados",
        minionColor: "pink",
        minionSize: 48,
        minionDamage: 25,
        minionSpeed: 5,
        minionHealth: 10000,
        minionCost: 1000,
        minionImage: minionImages[5],
      },
      Arktos: {
        id: "Arktos",
        minionColor: "pink",
        minionSize: 40,
        minionDamage: 15,
        minionSpeed: 2,
        minionHealth: 7000,
        minionCost: 1000,
        minionImage: minionImages[6],
      },
    };

    var PROJECTILE_DIRECTIONS = {
      UP: { id: 0 },
      RIGHT: { id: 1 },
      DOWN: { id: 2 },
      LEFT: { id: 3 },
    };

    // EventListeners
    // fixed bug when resizing
    window.addEventListener("resize", function () {
      canvasPosition = canvas.getBoundingClientRect();
    });

    // ragequit is to slow
    /*
    window.addEventListener("keydown", (e) => {
      var keyCode = e.key;
      if(keyCode == "Escape") {
        if (window.confirm('Do you really want to quit?')) {
            console.log("Quit");
            this.rageQuit();
        } else {
          console.log("Not Quit")
          return;
        }
      }
    });
    */


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
      
      // get indices of coordinates [y, x] 
      var coordArray = getCoordiantes(gridPositionX, gridPositionY);
      
      // clicked on statusbar: do nothing
      //if (gridPositionY < STATUS_BAR_HEIGHT) return;

      // clicked on quit (quit while playing)
      if (
        18.5*tileSize <= mouse.x &&
        mouse.x < 19.5*tileSize &&
        50 <= mouse.y &&
        mouse.y < 50+tileSize &&
        !gameOver
      ) {
        this.rageQuit();
        return;
      }

      // clicked on main menu (quit after playing)
      if (
        18.5*tileSize <= mouse.x &&
        mouse.x < 21*tileSize &&
        10.5*tileSize <= mouse.y &&
        mouse.y < 11.5*tileSize &&
        gameOver
      ) {
        this.rageQuit();
        return;
      }




      // clicked on change directory: change directory
      if (
        18.5*tileSize <= mouse.x &&
        mouse.x < 19.5*tileSize &&
        2.5*tileSize <= mouse.y &&
        mouse.y < 3.5*tileSize
      ) {
        sounds[1].play();
        directionSelector = (directionSelector + 1) % 4;
        return;
      }

      // clicked on sell: change sellSelector
      if (
        18.5*tileSize <= mouse.x &&
        mouse.x < 19.5*tileSize &&
        4.5*tileSize <= mouse.y &&
        mouse.y < 5.5*tileSize
      ) {
        sounds[1].play();
        upgradeSelctor = 0;
        sellSelector = (sellSelector + 1) % 2;
        return;
      }

       // clicked on upgrade: change upgradeSelector
       if (
        20*tileSize <= mouse.x &&
        mouse.x < 21*tileSize &&
        4.5*tileSize <= mouse.y &&
        mouse.y  < 5.5*tileSize
      ) {
        sounds[1].play();
        sellSelector = 0;
        upgradeSelctor = (upgradeSelctor + 1) % 2;
        return;
      }

      //if clicked on collect interest:
      if (
          20 * tileSize <= mouse.x &&
          mouse.x < 21 * tileSize &&
          6.5 * tileSize <= mouse.y &&
          mouse.y < 7.5 * tileSize &&
          prepPhase && collectPhase
        )
        {
          sounds[6].play();
        for (let i = 0; i < wave.length; i++) {
          switch (wave[i]) {
            case "Karpador":
              minionsToSpawn.push(
                new Minion(
                  MINIONS.Karpador.minionColor,
                  MINIONS.Karpador.minionSize,
                  MINIONS.Karpador.minionHealth,
                  MINIONS.Karpador.minionSpeed,
                  MINIONS.Karpador.minionDamage,
                  MINIONS.Karpador.minionImage
                )
              );
              break;
            case "Nebulak":
              minionsToSpawn.push(
                new Minion(
                  MINIONS.Nebulak.minionColor,
                  MINIONS.Nebulak.minionSize,
                  MINIONS.Nebulak.minionHealth,
                  MINIONS.Nebulak.minionSpeed,
                  MINIONS.Nebulak.minionDamage,
                  MINIONS.Nebulak.minionImage
                )
              );
              break;
            case "Gengar":
              minionsToSpawn.push(
                new Minion(
                  MINIONS.Gengar.minionColor,
                  MINIONS.Gengar.minionSize,
                  MINIONS.Gengar.minionHealth,
                  MINIONS.Gengar.minionSpeed,
                  MINIONS.Gengar.minionDamage,
                  MINIONS.Gengar.minionImage
                )
              );
              break;
            case "Zapdos":
              minionsToSpawn.push(
                new Minion(
                  MINIONS.Zapdos.minionColor,
                  MINIONS.Zapdos.minionSize,
                  MINIONS.Zapdos.minionHealth,
                  MINIONS.Zapdos.minionSpeed,
                  MINIONS.Zapdos.minionDamage,
                  MINIONS.Zapdos.minionImage
                )
              );
              break;
              case "Arktos":
                minionsToSpawn.push(
                  new Minion(
                    MINIONS.Arktos.minionColor,
                    MINIONS.Arktos.minionSize,
                    MINIONS.Arktos.minionHealth,
                    MINIONS.Arktos.minionSpeed,
                    MINIONS.Arktos.minionDamage,
                    MINIONS.Arktos.minionImage
                  )
                );
                break;
                case "Lavados":
                  minionsToSpawn.push(
                    new Minion(
                      MINIONS.Lavados.minionColor,
                      MINIONS.Lavados.minionSize,
                      MINIONS.Lavados.minionHealth,
                      MINIONS.Lavados.minionSpeed,
                      MINIONS.Lavados.minionDamage,
                      MINIONS.Lavados.minionImage
                    )
                  );
                  break;
            case "Garados":
              minionsToSpawn.push(
                new Minion(
                  MINIONS.Garados.minionColor,
                  MINIONS.Garados.minionSize,
                  MINIONS.Garados.minionHealth,
                  MINIONS.Garados.minionSpeed,
                  MINIONS.Garados.minionDamage,
                  MINIONS.Garados.minionImage
                )
              );
              break;
          }
        }
        localStorage.setItem("wave", []);
        gold = parseInt(localStorage.getItem("gold"));
        prepPhase = false;
        phase = false;
        collectPhase = false;
        return;
        }

      // clicked on ready
      if (
        18.5 * tileSize <= mouse.x &&
        mouse.x < 19.5 * tileSize &&
        6.5 *  tileSize<= mouse.y &&
        mouse.y < 7.5 * tileSize  &&
        prepPhase && !collectPhase
      )
       {
        sounds[1].play();
        // empty projectiles
        projectiles.splice(0,projectiles.length)

        this.ImReady()
        .then(result => wave = JSON.parse(localStorage.getItem("wave")))
        
        collectPhase = true;
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
        towerCost = TOWERS.PLANT.towerCost;
        buyCheck = true;
        towerType = "PlantTower1"
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
        towerCost = TOWERS.WATER.towerCost;
        buyCheck = true;
        towerType = "WaterTower1"
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
        towerCost = TOWERS.FIRE.towerCost;
        buyCheck = true;
        towerType = "FireTower1"
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
        towerCost = TOWERS.PSYCH.towerCost;
        buyCheck = true;
        towerType = "PsychTower1"
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
        towerCost = TOWERS.DRAGON.towerCost;
        buyCheck = true;
        towerType = "DragonTower1"
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
        if (
          pathTiles[i].x + tileGap === gridPositionX &&
          pathTiles[i].y + tileGap === gridPositionY
        ) {
          return;
        }
      }

      // check if there is already a Tower
      // either sell or upgrade
      for (let i = 0; i < towers.length; i++) {
        if (towers[i].x === gridPositionX && towers[i].y === gridPositionY) {
          let sellValue = Math.floor(.7*towers[i].towerCost)
          
          if (!sellSelector && !upgradeSelctor) {
            return;
          } 
          if(upgradeSelctor && prepPhase) {
            let towerType = towers[i].id
            let upgradecost = 0;
            // place new one
            switch(towerType) {
              case 1:
                upgradecost=TOWERS2.PLANT.towerCost;
                break;
              case 2:
                upgradecost=TOWERS2.WATER.towerCost;
                break;
              case 3:
                upgradecost=TOWERS2.FIRE.towerCost;
              case 4:
                upgradecost=TOWERS2.PSYCH.towerCost;
                break;
              case 5:
                upgradecost=TOWERS2.DRAGON.towerCost;
                break;
              case 6:
                upgradecost=TOWERS3.PLANT.towerCost;
                break;
              case 7:
                upgradecost=TOWERS3.WATER.towerCost;
                break;
              case 8:
                upgradecost=TOWERS3.FIRE.towerCost;
                break;
              case 9:
                upgradecost=TOWERS3.PSYCH.towerCost;
                break;
              case 10:
                upgradecost=TOWERS3.DRAGON.towerCost;
                break;
            }
            if (upgradecost>0 && upgradecost<=gold){
              var tempDirection = towers[i].direction;
              towers.splice(i,1); // remove tower
              // place new one
              switch(towerType) {
                case 1:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS2.PLANT.towerColor,
                    TOWERS2.PLANT.projectileColor,
                    TOWERS2.PLANT.damage,
                    TOWERS2.PLANT.speed,
                    TOWERS2.PLANT.towerCost,
                    tempDirection,
                    TOWERS2.PLANT.towerImage,
                    TOWERS2.PLANT.attackSpeed,
                    TOWERS2.PLANT.id
                  ))
                  break;
                case 2:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS2.WATER.towerColor,
                    TOWERS2.WATER.projectileColor,
                    TOWERS2.WATER.damage,
                    TOWERS2.WATER.speed,
                    TOWERS2.WATER.towerCost,
                    tempDirection,
                    TOWERS2.WATER.towerImage,
                    TOWERS2.WATER.attackSpeed,
                    TOWERS2.WATER.id
                  ))
                  break;
                  case 3:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS2.FIRE.towerColor,
                    TOWERS2.FIRE.projectileColor,
                    TOWERS2.FIRE.damage,
                    TOWERS2.FIRE.speed,
                    TOWERS2.FIRE.towerCost,
                    tempDirection,
                    TOWERS2.FIRE.towerImage,
                    TOWERS2.FIRE.attackSpeed,
                    TOWERS2.FIRE.id
                  ))
                  break;
                case 4:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS2.PSYCH.towerColor,
                    TOWERS2.PSYCH.projectileColor,
                    TOWERS2.PSYCH.damage,
                    TOWERS2.PSYCH.speed,
                    TOWERS2.PSYCH.towerCost,
                    tempDirection,
                    TOWERS2.PSYCH.towerImage,
                    TOWERS2.PSYCH.attackSpeed,
                    TOWERS2.PSYCH.id
                  ))
                  break;
                  case 5:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS2.DRAGON.towerColor,
                    TOWERS2.DRAGON.projectileColor,
                    TOWERS2.DRAGON.damage,
                    TOWERS2.DRAGON.speed,
                    TOWERS2.DRAGON.towerCost,
                    tempDirection,
                    TOWERS2.DRAGON.towerImage,
                    TOWERS2.DRAGON.attackSpeed,
                    TOWERS2.DRAGON.id
                  ))
                  break;
                  case 6:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS3.PLANT.towerColor,
                    TOWERS3.PLANT.projectileColor,
                    TOWERS3.PLANT.damage,
                    TOWERS3.PLANT.speed,
                    TOWERS3.PLANT.towerCost,
                    tempDirection,
                    TOWERS3.PLANT.towerImage,
                    TOWERS3.PLANT.attackSpeed,
                    TOWERS3.PLANT.id
                  ))
                  break;
                case 7:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS3.WATER.towerColor,
                    TOWERS3.WATER.projectileColor,
                    TOWERS3.WATER.damage,
                    TOWERS3.WATER.speed,
                    TOWERS3.WATER.towerCost,
                    tempDirection,
                    TOWERS3.WATER.towerImage,
                    TOWERS3.WATER.attackSpeed,
                    TOWERS3.WATER.id
                  ))
                  break;
                  case 8:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS3.FIRE.towerColor,
                    TOWERS3.FIRE.projectileColor,
                    TOWERS3.FIRE.damage,
                    TOWERS3.FIRE.speed,
                    TOWERS3.FIRE.towerCost,
                    tempDirection,
                    TOWERS3.FIRE.towerImage,
                    TOWERS3.FIRE.attackSpeed,
                    TOWERS3.FIRE.id
                  ))
                  break;
                case 9:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS3.PSYCH.towerColor,
                    TOWERS3.PSYCH.projectileColor,
                    TOWERS3.PSYCH.damage,
                    TOWERS3.PSYCH.speed,
                    TOWERS3.PSYCH.towerCost,
                    tempDirection,
                    TOWERS3.PSYCH.towerImage,
                    TOWERS3.PSYCH.attackSpeed,
                    TOWERS3.PSYCH.id
                  ))
                  break;
                  case 10:
                  towers.push(new Tower(
                    gridPositionX,
                    gridPositionY,
                    TOWERS3.DRAGON.towerColor,
                    TOWERS3.DRAGON.projectileColor,
                    TOWERS3.DRAGON.damage,
                    TOWERS3.DRAGON.speed,
                    TOWERS3.DRAGON.towerCost,
                    tempDirection,
                    TOWERS3.DRAGON.towerImage,
                    TOWERS3.DRAGON.attackSpeed,
                    TOWERS3.DRAGON.id
                  ))
                  break;
              }
              gold -=upgradecost;
            }
            this.upgrade(coordArray);
            if(towerType <=5 ) {
              sounds[2].play();
            }
            else if(towerType >= 6) {
              sounds[7].play();
            } 
            return;
          }
          if(sellSelector && !upgradeSelctor && prepPhase) {
            this.sell(coordArray);
            //sellSelector = 0; // BUG!!!! DO NOT USE HERE
            sounds[4].play();
            gold += sellValue;
            towers.splice(i, 1); // remove
            i--; // adjust for loop index
          }
        }
      }

      // place tower
      if (!sellSelector && prepPhase) {
        if (buyCheck&&gold >= towerCost) {
          // to to Check selected tower variable
          //towers.push(new Tower(gridPositionX, gridPositionY, 'blue', 'yellow', 500, 200, 100));
          switch (towerSelector) {
            case 1:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.PLANT.towerColor,
                  TOWERS.PLANT.projectileColor,
                  TOWERS.PLANT.damage,
                  TOWERS.PLANT.speed,
                  TOWERS.PLANT.towerCost,
                  directionSelector,
                  TOWERS.PLANT.towerImage,
                  TOWERS.PLANT.attackSpeed,
                  TOWERS.PLANT.id
                )
              );
              break;
            case 2:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.WATER.towerColor,
                  TOWERS.WATER.projectileColor,
                  TOWERS.WATER.damage,
                  TOWERS.WATER.speed,
                  TOWERS.WATER.towerCost,
                  directionSelector,
                  TOWERS.WATER.towerImage,
                  TOWERS.WATER.attackSpeed,
                  TOWERS.WATER.id
                )
              );
              break;
            case 3:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.FIRE.towerColor,
                  TOWERS.FIRE.projectileColor,
                  TOWERS.FIRE.damage,
                  TOWERS.FIRE.speed,
                  TOWERS.FIRE.towerCost,
                  directionSelector,
                  TOWERS.FIRE.towerImage,
                  TOWERS.FIRE.attackSpeed,
                  TOWERS.FIRE.id
                )
              );
              break;
            case 4:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.PSYCH.towerColor,
                  TOWERS.PSYCH.projectileColor,
                  TOWERS.PSYCH.damage,
                  TOWERS.PSYCH.speed,
                  TOWERS.PSYCH.towerCost,
                  directionSelector,
                  TOWERS.PSYCH.towerImage,
                  TOWERS.PSYCH.attackSpeed,
                  TOWERS.PSYCH.id
                )
              );
              break;
            case 5:
              towers.push(
                new Tower(
                  gridPositionX,
                  gridPositionY,
                  TOWERS.DRAGON.towerColor,
                  TOWERS.DRAGON.projectileColor,
                  TOWERS.DRAGON.damage,
                  TOWERS.DRAGON.speed,
                  TOWERS.DRAGON.towerCost,
                  directionSelector,
                  TOWERS.DRAGON.towerImage,
                  TOWERS.DRAGON.attackSpeed,
                  TOWERS.DRAGON.id
                )
              );
              break;
          }
          this.buy(coordArray, towerType)
          buyCheck = false;
          gold -= towerCost;
          towerCost=0;
          towerType=null;
        }
        
        else {
          store.addNotification({
            title: "Error",
            width: 300,
            height: 100,
            message: `Not enough money or nothing selected`,
            type: "warning", 
            container: "top-left", 
            animationIn: ["animated", "fadeIn"], 
            animationOut: ["animated", "fadeOut"], 
            dismiss: {
              duration: 3000,
            },
          });
        }
      }
    }
    );

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
          ctx.strokeStyle = "dodgerblue";
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

    // DEBUG ONLY
    function createGrid1() {
      // fills gameGrid array with tile objects
      for (let y = 0; y < canvas.height; y += tileSize) {
        for (let x = 0; x < canvas.width; x += tileSize) {
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
        towerImage,
        attackSpeed,
        towerId,
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
        this.attackSpeed = attackSpeed;
        this.projectileColor = projectileColor;
        this.damage = damage;
        this.speed = speed;
        this.towerCost = towerCost;
        this.direction = direction;
        this.towerImage = towerImage;
        this.id = towerId;
      }

      draw() {
        ctx.fillStyle = this.towerColor;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.towerImage, this.x, this.y, this.width, this.height);

        // draw damage
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        //ctx.fillText(this.damage, this.x + 15, this.y + 30);
      }

      update() {
        this.timer++;
        if (this.timer % this.attackSpeed === 0) {
          if(this.id === 2 || this.id === 7 || this.id === 12) {
            // water tower multiple projectiles  
            projectiles.push(  
              new Projectiles(
                this.x + 30,
                this.y + 30,
                this.damage,
                this.projectileColor,
                this.speed,
                0,
                this.attackSpeed
              )
            )
            projectiles.push(  
              new Projectiles(
                this.x + 30,
                this.y + 30,
                this.damage,
                this.projectileColor,
                this.speed,
                1,
                this.attackSpeed
              )
            )
            projectiles.push(  
              new Projectiles(
                this.x + 30,
                this.y + 30,
                this.damage,
                this.projectileColor,
                this.speed,
                2,
                this.attackSpeed
              )
            )
            projectiles.push(  
              new Projectiles(
                this.x + 30,
                this.y + 30,
                this.damage,
                this.projectileColor,
                this.speed,
                3,
                this.attackSpeed
              )
            )      
          }
          else {
            projectiles.push(
              // water tower multiple projectiles
              new Projectiles(
                this.x + 30,
                this.y + 30,
                this.damage,
                this.projectileColor,
                this.speed,
                this.direction,
                this.attackSpeed
                )
              ) 
            }
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
        /* // old HP
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 25);
        */
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.width*(this.health/this.maxHealth), this.height/4);
        ctx.closePath();
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
      ctx.font = "28px Orbitron";
      ctx.fillText("Gold: " + gold, 2.5*tileSize, 1.25*tileSize);
      ctx.fillText("Score: " + score, 6.5*tileSize, 1.25*tileSize);
      ctx.fillText("HP: " + HP, 0*tileSize, 1.25*tileSize);
      ctx.font = "20px Orbitron";
      ctx.fillText("Weather: ", 15.5*tileSize, 55);

      //ctx.fillText(weather, 16*tileSize, 1.5*tileSize);
      switch(weather) {
        case "Clouds":
          ctx.drawImage(cloudy,16*tileSize, 1*tileSize,1*tileSize,1*tileSize);
          break;
        case "Rain":
          ctx.drawImage(rainy,16*tileSize, 1*tileSize,0.75*tileSize,0.75*tileSize);
          break;
        case "Clear":
          ctx.drawImage(sunny,16*tileSize, 1*tileSize,0.75*tileSize,0.75*tileSize);
          break;
        case "Snow":
          ctx.drawImage(snowy,16*tileSize, 1*tileSize,0.75*tileSize,0.75*tileSize);
          break;
        case "Thunderstorm":
          ctx.drawImage(thunderstorm,16*tileSize, 1*tileSize,1*tileSize,1*tileSize);
          break;
        case "Tornado":
          ctx.drawImage(windy,16*tileSize, 1*tileSize,0.75*tileSize,0.75*tileSize);
          break;
      }
      
      ctx.fillText(
        "Current phase: " + (prepPhase ? "Preparation" : "Battle"),
        10.25*tileSize,
        100
      );
      ctx.fillText("Current round:  " + round, 10.25*tileSize, 55);

      // player health bar
      ctx.beginPath();
      if(37.5 < HP && HP <= 50) {
        ctx.fillStyle = "green";  
      }
      else if(25 < HP && HP <= 37.5) {
        ctx.fillStyle = "orange";  
      }
      else if(12.5 < HP && HP <= 25) {
        ctx.fillStyle = "yellow";  
      }
      else if(0 < HP && HP <= 12.5) {
        ctx.fillStyle = "red";  
      }
      ctx.fillRect(0*tileSize, 0.5*tileSize, 2*tileSize*(HP/50), 16);
      //ctx.fillStyle = "gray" make grey health
      //ctx.fillRect(3*tileSize, 1.5*tileSize, 3*tileSize*(HP/50), 16);
      ctx.closePath();

     // leave game
     if(!gameOver) {
      ctx.beginPath();
      ctx.rect(18.5 * tileSize, 50, 2.5*tileSize, tileSize);
      ctx.strokeStyle = "green";
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.font = "32px Orbitron";
      ctx.fillStyle = "green";
      ctx.fillText("Quit", 19.25 * tileSize, 1.5 * tileSize);
      ctx.stroke();
    }
      
      // highlight sell selector
      if (sellSelector) {
        // highlight
        ctx.beginPath();

        ctx.rect(18.5 * tileSize, 4.5 * tileSize, tileSize, tileSize);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "dodgerblue";
        ctx.stroke();
        ctx.closePath(); // https://stackoverflow.com/questions/9475432/html5-canvas-different-strokes/9475478
      }

      // highlight selected tower
      if (!sellSelector) {
        switch (towerSelector ) {
          case(1):
            ctx.beginPath();
            ctx.rect(16 * tileSize, 2.5 * tileSize, tileSize-tileGap, tileSize-tileGap);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "dodgerblue";
            ctx.stroke();
            ctx.closePath();
            break;
          case(2):
            ctx.beginPath();
            ctx.rect(16 * tileSize, 4.5 * tileSize, tileSize-tileGap, tileSize-tileGap);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "dodgerblue";
            ctx.stroke();
            ctx.closePath();
            break;
          case(3):
            ctx.beginPath();
            ctx.rect(16 * tileSize, 6.5 * tileSize, tileSize-tileGap, tileSize-tileGap);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "dodgerblue";
            ctx.stroke();
            ctx.closePath();
            break;
          case(4):
            ctx.beginPath();
            ctx.rect(16 * tileSize, 8.5 * tileSize, tileSize-tileGap, tileSize-tileGap);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "dodgerblue";
            ctx.stroke();
            ctx.closePath();
            break;
          case(5):
            ctx.beginPath();
            ctx.rect(16 * tileSize, 10.5 * tileSize, tileSize-tileGap, tileSize-tileGap);
            ctx.lineWidth = 5;
            ctx.strokeStyle = "dodgerblue";
            ctx.stroke();
            ctx.closePath();
            break;
        }
      }

      if (upgradeSelctor) {
        // highlight
        ctx.beginPath();
        ctx.rect(20 * tileSize, 4.5 * tileSize, tileSize, tileSize);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "dodgerblue";
        ctx.stroke();
        ctx.closePath();
      }

      
      if (collectPhase) {
        // highlight
        ctx.beginPath();
        ctx.rect(20 * tileSize, 6.5 * tileSize, tileSize, tileSize);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "green";
        ctx.stroke();
        ctx.closePath();
      }

      if (!collectPhase) {
        // highlight
        ctx.beginPath();
        ctx.rect(20 * tileSize, 6.5 * tileSize, tileSize, tileSize);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
      }

      if (prepPhase &&! collectPhase) {
        // highlight
        ctx.beginPath();
        ctx.rect(20 * tileSize, 6.5 * tileSize, tileSize, tileSize);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "orange";
        ctx.stroke();
        ctx.closePath();
      }


      switch(directionSelector) {
        case 0:
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "green";
          ctx.moveTo(20.5*tileSize, 3.25*tileSize);
          ctx.lineTo(20.5*tileSize, 2.75*tileSize);
          ctx.stroke();
          ctx.moveTo(20.25*tileSize, 3*tileSize);
          ctx.lineTo(20.5*tileSize, 3.25*tileSize);
          ctx.stroke();
          ctx.moveTo(20.75*tileSize, 3*tileSize);
          ctx.lineTo(20.5*tileSize, 3.25*tileSize);
          ctx.stroke();
          break;
        case 1:
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "green";
          ctx.moveTo(20.75*tileSize, 3*tileSize);
          ctx.lineTo(20.25*tileSize, 3*tileSize);
          ctx.stroke();
          ctx.moveTo(20.5*tileSize, 2.75*tileSize);
          ctx.lineTo(20.75*tileSize, 3*tileSize);
          ctx.stroke();
          ctx.moveTo(20.5*tileSize, 3.25*tileSize);
          ctx.lineTo(20.75*tileSize, 3*tileSize);
          ctx.stroke();
          break;
        case 2:
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "green";
          ctx.moveTo(20.5*tileSize, 3.25*tileSize);
          ctx.lineTo(20.5*tileSize, 2.75*tileSize);
          ctx.stroke();
          ctx.moveTo(20.25*tileSize, 3*tileSize);
          ctx.lineTo(20.5*tileSize, 2.75*tileSize);
          ctx.stroke();
          ctx.moveTo(20.75*tileSize, 3*tileSize);
          ctx.lineTo(20.5*tileSize, 2.75*tileSize);
          ctx.stroke();
          break;
        case 3:
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "green";
          ctx.moveTo(20.75*tileSize, 3*tileSize);
          ctx.lineTo(20.25*tileSize, 3*tileSize);
          ctx.stroke();
          ctx.moveTo(20.5*tileSize, 2.75*tileSize);
          ctx.lineTo(20.25*tileSize, 3*tileSize);
          ctx.stroke();
          ctx.moveTo(20.5*tileSize, 3.25*tileSize);
          ctx.lineTo(20.25*tileSize, 3*tileSize);
          ctx.stroke();
          break;
      }

      if (gameOver) {
        // defeat screen
        sounds[3].play();
        ctx.beginPath();
        ctx.rect(0, 2*tileSize,21.25*tileSize+2*tileGap  , 10*tileSize);
        ctx.lineWidth = "3";
        ctx.strokeStyle = "green";
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();

        // display score
        ctx.fillStyle = "red";
        ctx.font = "150px Orbitron";
        ctx.fillText("Gameover", 3.75*tileSize, 5*tileSize);
        ctx.font = "80px Orbitron";
        ctx.fillText("Survived Waves: " + round, 3.75*tileSize, 7*tileSize);
        ctx.fillText("Score: " + score, 3.75*tileSize, 9*tileSize);


        // draw back to main menu button
        ctx.beginPath();
        ctx.rect(18.5 * tileSize, 10.5*tileSize, 2.5*tileSize, 1*tileSize);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.font = "24px Orbitron";
        ctx.fillStyle = "green";
        ctx.fillText("Mainmenu", 18.75 * tileSize, 11.20 * tileSize);
        ctx.stroke();
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
          sounds[5].play();
          let reward = minions[i].maxHealth / 10;
          gold += reward;
          score += reward;
          // remove last minion
          toBeDeleted.push(i); // remove
          //i--; // adjust loop index
        } else if (minions[i].y > 704 && minions[i].y < 708.4) {
          HP -= minions[i].minionDamage;
          this.hit(minions[i].minionDamage);
          sounds[0].play();
          toBeDeleted.push(i); //remove
        }
      }
      for (let i = toBeDeleted.length - 1; i >= 0; i--) {
        minions.splice(toBeDeleted[i], 1);
        if(minions.length === 0){
          phase = true;
        }
      }

      // minion spawner
      if (frame % minionsInterval === 0 && minionsToSpawn.length > 0) {
        minions.push(minionsToSpawn.pop());
      }
    };

    var handleGame = () => {
    if (HP < 1 ) {
            gameOver = true;
          }
      if (phase && minions.length < 1 && minionsToSpawn.length < 1 && !prepPhase) {
        prepPhase = true;
        this.updateGameState(gold,HP);
        if (minionsInterval > 30) {
          minionsInterval -= 5;
        }
        round += 1;
      }
    };

    function handleProjectiles() {
    if(!prepPhase){
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
        if (   
            (projectiles[i] && projectiles[i].y < 2*tileSize + 3*tileGap) || // upper bound
            (projectiles[i] && projectiles[i].x > BOARD_WIDTH - 3*tileGap) || // right bound
            (projectiles[i] && projectiles[i].y > 2*tileSize+BOARD_HEIGHT - 3*tileGap) ||  // bottom bound
            (projectiles[i] && projectiles[i].x < 0 + 3*tileGap) // left bound
          ) {
          projectiles.splice(i, 1); // remove
          i--; // adjust for loop index
        }
      }
    }}

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
      ctx.moveTo(tileSize * 18, tileSize * 8);
      ctx.lineTo(STATUS_BAR_WIDTH, tileSize * 8);
      ctx.stroke();
      ctx.lineWidth = 1;

      // tower info
      if(towerSelector==0) {
        ctx.fillStyle = "green";
        ctx.font = "18px Orbitron";
        ctx.fillText("Click on a tower", tileSize * 18.5, tileSize * 8.5);
        ctx.fillText("to get information", tileSize * 18.5, tileSize * 9);
      }
      else {
        ctx.fillStyle = "green";
        ctx.font = "18px Orbitron";
        ctx.fillText("LEVEL 1/2/3", tileSize * 18.25  , tileSize * 8.5);
        switch(towerSelector-1) {
          case(0):
            ctx.fillText("Cost:", tileSize * 18.25, tileSize * 9);
            ctx.fillText(towerList[towerSelector-1].towerCost + " / " + TOWERS2.PLANT.towerCost + " / " + TOWERS3.PLANT.towerCost, tileSize * 18.25, tileSize * 9.5);
            ctx.fillText("Damage:", tileSize * 18.25, tileSize * 10.25);
            ctx.fillText(towerList[towerSelector-1].damage + " / " + TOWERS2.PLANT.damage + " / " + TOWERS3.PLANT.damage, tileSize * 18.25, tileSize * 10.75);
            ctx.fillText("Attackspeed:", tileSize * 18.25, tileSize * 11.5);
            ctx.fillText(towerList[towerSelector-1].attackSpeed + " / " + TOWERS2.PLANT.attackSpeed + " / " + TOWERS3.PLANT.attackSpeed, tileSize * 18.25, tileSize * 12);
            break;

          case(1):
            ctx.fillText("Cost:", tileSize * 18.25, tileSize * 9);
            ctx.fillText(towerList[towerSelector-1].towerCost + " / " + TOWERS2.WATER.towerCost + " / " + TOWERS3.WATER.towerCost, tileSize * 18.25, tileSize * 9.5);
            ctx.fillText("Damage:", tileSize * 18.25, tileSize * 10.25);
            ctx.fillText(towerList[towerSelector-1].damage + " / " + TOWERS2.WATER.damage + " / " + TOWERS3.WATER.damage, tileSize * 18.25, tileSize * 10.75);
            ctx.fillText("Attackspeed:", tileSize * 18.25, tileSize * 11.5);
            ctx.fillText(towerList[towerSelector-1].attackSpeed + " / " + TOWERS2.WATER.attackSpeed + " / " + TOWERS3.WATER.attackSpeed, tileSize * 18.25, tileSize * 12);
            break;
          case(2):
            ctx.fillText("Cost:", tileSize * 18.25, tileSize * 9);
            ctx.fillText(towerList[towerSelector-1].towerCost + " / " + TOWERS2.FIRE.towerCost + " / " + TOWERS3.FIRE.towerCost, tileSize * 18.25, tileSize * 9.5);
            ctx.fillText("Damage:", tileSize * 18.25, tileSize * 10.25);
            ctx.fillText(towerList[towerSelector-1].damage + " / " + TOWERS2.FIRE.damage + " / " + TOWERS3.FIRE.damage, tileSize * 18.25, tileSize * 10.75);
            ctx.fillText("Attackspeed:", tileSize * 18.25, tileSize * 11.5);
            ctx.fillText(towerList[towerSelector-1].attackSpeed + " / " + TOWERS2.FIRE.attackSpeed + " / " + TOWERS3.FIRE.attackSpeed, tileSize * 18.25, tileSize * 12);
            break;

          case(3):
            ctx.fillText("Cost:", tileSize * 18.25, tileSize * 9);
            ctx.fillText(towerList[towerSelector-1].towerCost + " / " + TOWERS2.PSYCH.towerCost + " / " + TOWERS3.PSYCH.towerCost, tileSize * 18.25, tileSize * 9.5);
            ctx.fillText("Damage:", tileSize * 18.25, tileSize * 10.25);
            ctx.fillText(towerList[towerSelector-1].damage + " / " + TOWERS2.PSYCH.damage + " / " + TOWERS3.PSYCH.damage, tileSize * 18.25, tileSize * 10.75);
            ctx.fillText("Attackspeed:", tileSize * 18.25, tileSize * 11.5);
            ctx.fillText(towerList[towerSelector-1].attackSpeed + " / " + TOWERS2.PSYCH.attackSpeed + " / " + TOWERS3.PSYCH.attackSpeed, tileSize * 18.25, tileSize * 12);
            break;
          case(4):
            ctx.fillText("Cost:", tileSize * 18.25, tileSize * 9);
            ctx.fillText(towerList[towerSelector-1].towerCost + " / " + TOWERS2.DRAGON.towerCost + " / " + TOWERS3.DRAGON.towerCost, tileSize * 18.25, tileSize * 9.5);
            ctx.fillText("Damage:", tileSize * 18.25, tileSize * 10.25);
            ctx.fillText(towerList[towerSelector-1].damage + " / " + TOWERS2.DRAGON.damage + " / " + TOWERS3.DRAGON.damage, tileSize * 18.25, tileSize * 10.75);
            ctx.fillText("Attackspeed:", tileSize * 18.25, tileSize * 11.5);
            ctx.fillText(towerList[towerSelector-1].attackSpeed + " / " + TOWERS2.DRAGON.attackSpeed + " / " + TOWERS3.DRAGON.attackSpeed, tileSize * 18.25, tileSize * 12);
            break;
        }

      }
      //towerList[towerSelector-1].id

      // draw towers
      for (let i = 0; i < towerList.length; i++) {
        towerList[i].draw();
      }

      ctx.beginPath();
      ctx.rect(18.5 * tileSize, 2.5 * tileSize, 64, 64);
      ctx.font = "14px Orbitron";
      ctx.fillStyle = "green";
      ctx.fillText("Rotate", 18.5 * tileSize + 7.5, 2.5 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(20 * tileSize, 2.5 * tileSize, 64, 64);  
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(18.5 * tileSize, 4.5 * tileSize, 64, 64);
      ctx.font = "20px Orbitron";
      ctx.fillStyle = "green";
      ctx.fillText("Sell", 18.5 * tileSize + 10, 4.5 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(20 * tileSize, 4.5 * tileSize, 64, 64);
      ctx.font = "12px Orbitron";
      ctx.fillStyle = "green";
      ctx.fillText("Upgrade", 20 * tileSize + 5, 4.5 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(18.5 * tileSize, 6.5 * tileSize, 64, 64);
      ctx.font = "14px Orbitron";
      ctx.fillStyle = "green";
      ctx.fillText("Ready", 18.5 * tileSize + 5, 6.5 * tileSize + 38);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(20 * tileSize, 6.5 * tileSize, 64, 64);
      ctx.font = "12px Orbitron";
      ctx.fillStyle = "green";
      ctx.fillText("Spawn", 20 * tileSize + 10, 6.5 * tileSize + 38);
      ctx.fillText("Wave", 20 * tileSize + 10, 6.8 * tileSize + 38);
      ctx.stroke();
    }

    function createShop() {
      towerList.push(
        new Tower(
          16 * tileSize,
          2.5 * tileSize,
          TOWERS.PLANT.towerColor,

          TOWERS.PLANT.projectileColor,
          TOWERS.PLANT.damage,
          TOWERS.PLANT.speed,
          TOWERS.PLANT.towerCost,
          directionSelector,
          TOWERS.PLANT.towerImage,
          TOWERS.PLANT.attackSpeed,
          TOWERS.PLANT.id
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          4.5 * tileSize,
          TOWERS.WATER.towerColor,
          TOWERS.WATER.projectileColor,
          TOWERS.WATER.damage,
          TOWERS.WATER.speed,
          TOWERS.WATER.towerCost,
          directionSelector,
          TOWERS.WATER.towerImage,
          TOWERS.WATER.attackSpeed,
          TOWERS.WATER.id
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          6.5 * tileSize,
          TOWERS.FIRE.towerColor,
          TOWERS.FIRE.projectileColor,
          TOWERS.FIRE.damage,
          TOWERS.FIRE.speed,
          TOWERS.FIRE.towerCost,
          directionSelector,
          TOWERS.FIRE.towerImage,
          TOWERS.FIRE.attackSpeed,
          TOWERS.FIRE.id
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          8.5 * tileSize,
          TOWERS.PSYCH.towerColor,
          TOWERS.PSYCH.projectileColor,
          TOWERS.PSYCH.damage,
          TOWERS.PSYCH.speed,
          TOWERS.PSYCH.towerCost,
          directionSelector,
          TOWERS.PSYCH.towerImage,
          TOWERS.PSYCH.attackSpeed,
          TOWERS.PSYCH.id
        )
      );
      towerList.push(
        new Tower(
          16 * tileSize,
          10.5 * tileSize,
          TOWERS.DRAGON.towerColor,
          TOWERS.DRAGON.projectileColor,
          TOWERS.DRAGON.damage,
          TOWERS.DRAGON.speed,
          TOWERS.DRAGON.towerCost,
          directionSelector,
          TOWERS.DRAGON.towerImage,
          TOWERS.DRAGON.attackSpeed,
          TOWERS.DRAGON.id
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
      handleGame();
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

    function getCoordiantes(gridPositionX, gridPositionY) {
      let x = (gridPositionX - tileGap) / tileSize;
      let y = (gridPositionY - tileGap - 2 * tileSize) / tileSize;
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
      </div>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Game);
