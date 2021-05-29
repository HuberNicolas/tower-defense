import React from "react";
import styled from "styled-components";
import { BaseContainer, DESKTOP_WIDTH } from "../../helpers/layout";
import { withRouter } from "react-router-dom";
import titleMusic from "../../assets/music/3d galax - arrangement nh.mp3";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Text = styled.h1`
  font-weight: bold;
  font-family: "Press Start 2P";
  color: yellow;
  text-align: center;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Title extends React.Component {
  constructor() {
    super();
    this.state = {
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerHeight - 200,
      play : false,
    };


  }
  audio = new Audio(titleMusic);

  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */

  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */

  canvasRef = React.createRef();
  componentDidMount() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    let canvasPosition = canvas.getBoundingClientRect();
    var frame = 0;
    const TILE = 64;
    var minionImages = [];
    var towerImages = [];

    this.audio.addEventListener('ended', () => this.setState({ play: false }));

    
    function init() {
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

    
      window.requestAnimationFrame(draw);
    }
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min) + min);
    }

    function draw() {
      frame++;
      if (frame % 30  == 0) {
        ctx.globalCompositeOperation = "destination-over";
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight-200); // clear whole canvas

        // draw random towers and monsters
        ctx.drawImage(towerImages[getRandomInt(0, 15)], 5*TILE, 2*TILE, 2*TILE, 2*TILE);
        ctx.drawImage(towerImages[getRandomInt(0, 15)], 11*TILE, 2*TILE, 2*TILE, 2*TILE);
        ctx.drawImage(towerImages[getRandomInt(0, 15)], 5*TILE, 6*TILE, 2*TILE, 2*TILE);
        ctx.drawImage(towerImages[getRandomInt(0, 15)], 11*TILE, 6*TILE, 2*TILE, 2*TILE);

        ctx.drawImage(minionImages[getRandomInt(0, 7)], 17*TILE, 2*TILE, 2*TILE, 2*TILE);
        ctx.drawImage(minionImages[getRandomInt(0, 7)], 23*TILE, 2*TILE, 2*TILE, 2*TILE);
        ctx.drawImage(minionImages[getRandomInt(0, 7)], 17*TILE, 6*TILE, 2*TILE, 2*TILE);
        ctx.drawImage(minionImages[getRandomInt(0, 7)], 23*TILE, 6*TILE, 2*TILE, 2*TILE);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = "green";
        ctx.strokeRect(0, 0, TILE, TILE);

        // draw grid
        for(var i = 0; i < window.innerWidth; i+= TILE) {
          for(var j = 0; j < window.innerHeight-300; j+= TILE) {
            ctx.strokeRect(i, j, TILE, TILE);
          }
        }

        // draw random tiles
        for(var k = 0; k < getRandomInt(0,40); k++) {
          ctx.fillStyle = "dodgerblue";
          ctx.fillRect(getRandomInt(0, 29)*TILE, getRandomInt(0, 10)*TILE, TILE, TILE);
        }
      }
      window.requestAnimationFrame(draw);
    }

    init();
  }

  componentWillUnmount() {
    this.audio.removeEventListener('ended', () => this.setState({ play: false }));  
  }



  /*
  // Attempt to play music with react was not successfull :')

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.audio != this.props.audio)
  }
  

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
    this.audio.loop = true;
  }
  

  stopMusic = () => {
    this.setState(this.audio.pause());
    this.audio.loop = false;
  }

  startMusic = () => {
    this.setState({ play: this.state.play }, () => {
      this.audio.play();
    });
    this.audio.loop = true;
  }
  */

  render() {
    return (
      <body
        style={{
          height: "100%",
          position: "absolute",
          left: "0px",
          width: "100%",
          overflow: "hidden",
        }
      }
      
      
        onClick={() => {
        this.props.history.push(`/login`);
        }}
      >
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron&family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />

        <BaseContainer>
          <FormContainer>
            <canvas
              ref={this.canvasRef}
              width={this.state.canvasWidth}
              height={this.state.canvasHeight}
              id={"title"}
              style={{ backgroundColor: "black", zIndex: 1 }}
            />
            <Text>Towers vs. Monsters</Text>
            {/*<button onClick={this.startMusic}>{this.state.play ? 'Pause' : 'Play'}</button>*/}
            <Text>Click here to start</Text>
            <div>
            <audio ref="audio_tag" src="https://github.com/sopra-fs21-group-10/td-client/blob/530d6d01266c37e845cc64cc786719a79ff1769d/src/assets/music/3d%20galax%20-%20arrangement%20nh.mp3?raw=true" autoPlay loop/>
            </div>
          </FormContainer>
        </BaseContainer>
      </body>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Title);
