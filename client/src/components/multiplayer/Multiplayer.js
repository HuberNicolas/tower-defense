import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import Lobby from '../shared/models/Lobby';
import Lobby1 from '../../views/Lobby1';
import "./Multiplayer.css"
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import multiplayer from "../../multiplayer.jpg";
var sectionStyle = {
  width: "100%",
  height: "768px",
  backgroundImage: "url(" +  multiplayer  + ")"
};


const Container = styled(BaseContainer)`
  color: white;
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
  color: white;
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
  color: white;
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
  color: white;
  text-align: center;
`;
const ButtonNext = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: right;
  justify-content: right;
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
      token: localStorage.getItem("token")
    };
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
   //redirecting token
   async createLobby() {//creating a Lobby
          try {
            const requestBody = JSON.stringify({
              token: localStorage.getItem('token')
            });
            const response = await api.post("/lobbies", requestBody);

            // Get the returned lobby and update a new object.
            const lobby = new Lobby(response.data);
            console.log(lobby);

            // creation successfully worked --> navigate to the next page lul
            this.props.history.push(`/lobby`);
          } catch (error) {
            alert(`Something went wrong during the creation of lobby: \n${handleError(error)}`);
          }
        }
   reload(){
       window.location.reload(false);
     }
   highlight = (e) => {
       this.setState({
           bgColor: "red"
       })
     }
   async selectLobby(LobbyId) {
             try {

               this.highlight(LobbyId);
             } catch (error) {
               alert(`Something went wrong during selecting user: \n${handleError(error)}`);
             }
           }
   async joinByClick(LobbyId) {
           try {


             localStorage.setItem('redirectedId', LobbyId);//sent the userid to check later if it matches the profile to be edited


             this.props.history.push("/lobby"); //redirect to profile
           } catch (error) {
             alert(`Something went wrong during viewing the profilepage: \n${handleError(error)}`);
           }
         }


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
  async componentDidMount() {
           try {
             const response = await api.get("/lobbies");
             // delays continuous execution of an async operation for 1 second.
             // This is just a fake async call, so that the spinner can be displayed
             // feel free to remove it :)
             await new Promise(resolve => setTimeout(resolve, 1000));

             // Get the returned users and update the state.
             this.setState({ lobbies: response.data });

             //tracking error
             console.log('request to:', response.request.responseURL);
             console.log('status code:', response.status);
             console.log('status text:', response.statusText);
             console.log('requested data:', response.data);
             console.log(response);

           } catch (error) {
             alert(`Something went wrong while fetching lobbies: \n${handleError(error)}`);
           }
         }

  render() {
    return (
    <div style={sectionStyle}>
        <BaseContainer>
        <Title>Multiplayer</Title>
        <div id="parent">
                  <div id="wide">Create Lobby</div>
                  <div id="narrow">Open Lobbies</div>
        </div>
        <div id="parent">
                  <Player1>
                  <Button
                                                width="50%"
                                                onClick={() => {
                                                  this.createLobby();
                                                }}
                                            >
                                              Create a new lobby
                                            </Button>
                                    </Player1>
                  <Player2>
                         <Container>
                                               <h2>Lobbylist</h2>

                                               {!this.state.lobbies ? (
                                                 <Spinner />
                                               ) : (
                                                 <div>
                                                   <Users>
                                                     {this.state.lobbies.map(lobby => {
                                                       return (
                                                         <PlayerContainer key={lobby.lobbyId}
                                                         style={{backgroundColor: this.state.bgColor}}
                                                         onClick={() => {
                                                                         this.selectLobby();//highlight it;

                                                                       }}
                                                         >
                                                           <Lobby1 lobby={lobby} />

                                                         </PlayerContainer>
                                                       );
                                                     })}
                                                   </Users>
                                                 </div>
                                               )}
                                             </Container>
                  </Player2>
        </div>
        <div id="parent">
                  <div id="wide"></div>
                  <div id="narrow">
                  <div id="parent">
                  <ButtonNext>
                  <div id="parent">
                                    <div id="wide2"><Button
                                                                           width="50%"
                                                                           onClick={() => {
                                                                           //here comes directory
                                                                           }}
                                                                         >
                                                                           Join lobby
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
                          </div>
                  </div>
        </div>

          <FormContainer>
            <Button
                width="50%"
                onClick={() => {
                  this.props.history.push(`/main`);
                }}
            >
              Back to Main Menu
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
