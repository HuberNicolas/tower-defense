import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import Lobby from '../shared/models/Lobby';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import mainmenu from "../../mainmenu.jpg";
const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
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
  //border: 1px solid black;
  flex-direction: column;
  align-items: center;
  height: 400px;

`;
const Title = styled.h1`
  font-weight: bold;
  color: yellow;
  text-align: center;
`;
var sectionStyle = {
  width: "100%",
  height: "768px",
  backgroundImage: "url(" +  mainmenu  + ")"
};
const background = styled.img`
  display: flex;
  justify-content: center;
  backgroundImage: mainmenu;
`;

const Logo = styled.img`
    width: 669px;
    height: 557px;
    margin: 20px;
`;

class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      nothing: null
    };
  }
 //refreshes the website
     reload(){
       window.location.reload(false);
     }
 //logout removes your token
     logout() {
         localStorage.removeItem('token');
         this.props.history.push('/login');
       }


  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }


  componentDidMount() {}

  render() {
    return (
    <div style={sectionStyle}>

      <BaseContainer>

      <Title>Main Menu</Title>
            <ButtonContainer>
              <Button
                width="50%"
                onClick={() => {

                  this.props.history.push(`/singleplayer`);
                }}
              >
                Singleplayer
              </Button>
              <h1> </h1>
              <Button
                  width="50%"
                  onClick={() => {

                    this.props.history.push(`/multiplayer`);
                  }}
              >
                Multiplayer
              </Button>
              <h1> </h1>
              <Button
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/settings`);
                  }}
              >
                Edit User Settings
              </Button>
              <h1> </h1>
              <Button
                                width="50%"
                                onClick={() => {
                                  this.logout();
                                }}
                            >
                              logout
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
