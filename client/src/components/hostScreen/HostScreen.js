import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import "./HostScreen.css"
import { Button } from '../../views/design/Button';
import Lobby from "../shared/models/Lobby"
import lobby from "../../lobby.jpg";
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

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

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
        lobbyOwner: null,
        player2: null,
        lobbyId: null,
        player2Status: null
    };
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  async leaveLobby() {
    try {
      const requestBody = JSON.stringify({
        lobbyId: localStorage.getItem("lobbyId"),
        token: localStorage.getItem('token')
      });
      await api.put("lobbies/"+localStorage.getItem("lobbyId"), requestBody);
      this.props.history.push("/multiplayer");
    } catch (error) {
      store.addNotification({
        title: 'Error',
        width:300,
        height:100,
        message: `Something went wrong during leaving the lobby: \n${handleError(error)}`,
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

  async displayPlayers(){
        try{
            const response = await api.get("lobbies/"+localStorage.getItem("lobbyId"));
            const lobby = new Lobby(response.data);
            this.setState({lobbyOwner: lobby.lobbyOwner, player2: lobby.player2, player2Status: lobby.player2Status})
        }
        catch(error){
         store.addNotification({
          title: 'Error',
          width:300,
          height:100,
          message: `Something went wrong while displaying players: \n${handleError(error)}`,
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

   componentDidMount() {
        this.displayPlayers();
   }

  render() {
    return (
    <div style={sectionStyle}>
      <BaseContainer>
      <Title>HostScreen</Title>
      <div id="parent">
        <div id="wide">
        <h1>Hostname: </h1>
        <p>{this.state.lobbyOwner}</p>
        </div>
        <div id="narrow">
        <h1> player2 name: </h1>
        <p>{this.state.player2}</p>
        </div>
      </div>
      <ButtonContainer>
        <Button
        disabled={!this.state.player2Status}
          width="50%"
          onClick={() => {
            //push to multiplayer game!
          }}
        >
          Start Game!
        </Button>
      </ButtonContainer>
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
