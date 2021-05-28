import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Button3 } from "../../views/design/Button3";
import singleplayer from "../../singleplayer.jpg";

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

var sectionStyle = {
  width: "100%",
  height: "768px",
};
const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 450px;
  justify-content: center;
  border-style: solid;
  border-color: rgba(16, 89, 0, 1);
`;

const Title = styled.h1`
  font-family: "Press Start 2P";
  font-weight: bold;
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
class Login extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      name: null,
      username: null
    };
  }
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

  // starts a new single player game
  async start() {
    try {
      const requestBody = JSON.stringify({
        player1Id: localStorage.getItem('userId')
      });
      const response = await api.post('/games', requestBody);
      // Store everything relevant to the game into the local storage.
      localStorage.setItem('gameId', response.data.gameId);
      localStorage.setItem("weather", response.data.player1.weather);
      localStorage.setItem("gold", response.data.player1.gold);
      localStorage.setItem("health", response.data.player1.health);
      localStorage.setItem("board", response.data.player1.board);
      this.props.history.push(`/game`);
    } catch (error) {
      store.addNotification({
            title: 'Error',
            width:300,
            height:100,
            message: `Something went wrong while starting the game: \n${handleError(error)}`,
            type: 'warning',                         // 'default', 'success', 'info', 'warning'
            container: 'top-left',                // where to position the notifications
            animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
            animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
            dismiss: {
              duration: 4000
            }
        })
    }
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {}

  render() {
    return (
    <div style={sectionStyle}>
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
            href="https://fonts.googleapis.com/css2?family=Orbitron&family=Press+Start+2P&display=swap"
            rel="stylesheet"/>
      <BaseContainer>
      <Title>Singleplayer</Title>
        <FormContainer>
        <Button3
              width="50%"
              onClick={() => {
                this.start();
              }}
          >
            Start Game
          </Button3>
          <h1></h1>
          <Button3
              width="50%"
              onClick={() => {

                this.props.history.push(`/main`);
              }}
          >
            Back to Main Menu
          </Button3>
        </FormContainer>
      </BaseContainer>
      </div>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
