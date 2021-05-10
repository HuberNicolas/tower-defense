import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import Player from '../../views/Player';
import Lobby from "../shared/models/Lobby"
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { component } from "react";
import "./Lobby.css"
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
        bgColor: "",
        token: localStorage.getItem("token"),
        lobbyId: localStorage.getItem("lobbyId")
    };


  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }
//highlight function, used to invite later on
  highlight = (e) => {
    this.setState({
        bgColor: "red"

    })
  }
  //reloads the website
  reload(){
    window.location.reload(false);
  }
//tbd invite function prototype
  async selectUser(userid) {
          try {

            this.highlight(userid);
          } catch (error) {
            store.addNotification({
                      title: 'Error',
                      width:300,
                      height:100,
                      message: `Something went wrong during selecting the user: \n${handleError(error)}`,
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
//if you leave the lobby it gets deleted if host else you get redirected to lobbyoverview
  async leaveLobby() {
          try {
            const requestBody = JSON.stringify({
                    lobbyId: localStorage.getItem("lobbyId"),
                    token: localStorage.getItem('token')
                  });
            const response = await api.put("lobbies/"+localStorage.getItem("lobbyId"), requestBody);
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

//displaying userlist so that the host can invite
   async componentDidMount() {
         try {
           const response = await api.get('/users');
           // delays continuous execution of an async operation for 1 second.
           // This is just a fake async call, so that the spinner can be displayed
           // feel free to remove it :)
           await new Promise(resolve => setTimeout(resolve, 1000));

           // Get the returned users and update the state.
           this.setState({ users: response.data });

           //tracking error
           console.log('request to:', response.request.responseURL);
           console.log('status code:', response.status);
           console.log('status text:', response.statusText);
           console.log('requested data:', response.data);
           console.log(response);

         } catch (error) {
           store.addNotification({
                     title: 'Error',
                     width:300,
                     height:100,
                     message: `Something went wrong while fetching users: \n${handleError(error)}`,
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


  render() {
    return (
    <div style={sectionStyle}>
        <BaseContainer>
        <Title>Lobby</Title>
        <div id="parent">
          <div id="wide">Host</div>
          <div id="narrow">Player2</div>
        </div>
        <div id="parent">
          <Player1>
              <Container>
                      <h2>Userlist</h2>

                      {!this.state.users ? (
                        <Spinner />
                      ) : (
                        <div>
                          <Users>
                            {this.state.users.map(user => {
                              return (
                                <PlayerContainer key={user.id}
                                style={{backgroundColor: this.state.bgColor}}
                                onClick={() => {
                                                this.selectUser();//highlight it;

                                              }}
                                >
                                  <Player user={user} />

                                </PlayerContainer>
                              );
                            })}
                          </Users>
                        </div>
                      )}
                    </Container>
          </Player1>
          <Player2>
              <p>Readystatus</p>
              <p>Kick Player</p>
          </Player2>
                </div>

        <ButtonNext>
        <div id="parent">
                  <div id="wide2"><Button
                                                         width="50%"
                                                         onClick={() => {
                                                         //here comes directory
                                                         }}
                                                       >
                                                         Invite Player
                                                       </Button></div>
                  <div id="narrow2"><Button
                                                           width="50%"
                                                           onClick={() => {
                                                           this.reload()
                                                           }}
                                                         >
                                                           Reload
                                                         </Button></div>
                </div>
                    </ButtonNext>
          <FormContainer>
          <Button
                                  width="50%"
                                  onClick={() => {
                                    this.leaveLobby();
                                  }}
                              >
                                Leave Lobby
                              </Button>
          <Button>
                                      <a href={"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}>Testingground (Dont click on it)</a>

                                  </Button>
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
