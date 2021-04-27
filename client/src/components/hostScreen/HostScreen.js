import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import Player from '../../views/Player';
import "./HostScreen.css"
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { component } from "react";
import Lobby from "../shared/models/Lobby"
import lobby from "../../lobby.jpg";
var sectionStyle = {
  width: "100%",
  height: "768px",
  backgroundImage: "url(" +  lobby  + ")"
};
const Container = styled(BaseContainer)`
  color: black;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;
const Player1 = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
  color: black;
  border: 1px solid black;
  width: 560px;
`;
const Player2 = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
  border: 1px solid black;
  width: 560px;
  color: black;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1.0);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const Title = styled.h1`
  font-weight: bold;
  color: black;
  text-align: center;
`;
const ButtonNext = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  //border: 1px solid black;
  width: 530px;
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
        owner: null,
        player2: null
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
  //doesn't work
  async leaveLobby() {
          try {
            const requestBody = JSON.stringify({
                    lobbyId: localStorage.getItem("lobbyId")
                  });

            this.props.history.push("/multiplayer"); //redirect to profile
          } catch (error) {
            alert(`Something went wrong during leaving the lobby: \n${handleError(error)}`);
          }
        }
  reload(){
      window.location.reload(false);
  }
  async displayPlayers(lobbyId){
        try{
            const response = await api.get("lobbies"+lobbyId);
            const lobby = new Lobby(response.data);
            //this.setState({owner: owner.username, player2: player2.username})
        }
        catch(error){
         alert(`Something went wrong during displaying the players: \n${handleError(error)}`);
        }
  }
  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */

   componentDidMount() {
        //this.displayPlayers(lobbyId);
   }


  render() {
    return (
    <div style={sectionStyle}>
        <BaseContainer>
        <Title>Lobby</Title>
        <div id="parent">
          <div id="wide">Host</div>
          <div id="narrow">Player2</div>
        </div>

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
