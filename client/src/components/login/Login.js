import React, {useState} from "react";
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import { Button2 } from '../../views/design/Button2';
import { Button3 } from '../../views/design/Button3';
import login from "../../login.jpg";
import { store } from 'react-notifications-component';

import 'react-notifications-component/dist/theme.css';
import 'animate.css';

//import Typewriter from "typewriter-effect";

var sectionStyle = {
  width: "100%",
  height: "768px",
  background: "black"
};

var typewriterStyle = {
  color: "white",
};
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
  height: 500px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: black;
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

const PasswordInputField = styled.input.attrs({
  type: "password"
})`
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
  font-family: 'Press Start 2P';
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
  font-family: 'Press Start 2P';
  color: yellow;
  text-align: center;
`;

const TerminalContainer = styled.div`
  border-style: solid;
  border-width: 2px;
  border-color: rgba(16, 89, 0, 1);
  font-family: 'Press Start 2P';
  font-size: 12px;
  color: white;
`;

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
    };
  }
  
//login function; you get a token and an id
  async login() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.put('/users', requestBody);

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token & user id into the local storage.
      localStorage.setItem('token', user.token);
      localStorage.setItem('userId', user.userId);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/main`);
    } catch (error) {
        store.addNotification({
          title: 'Error',
          width:300,
          height:100,
          message: `Something went wrong during the login: \n${handleError(error)}`,
          type: 'info',                         // 'default', 'success', 'info', 'warning'
          container: 'top-left',                // where to position the notifications
          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
          dismiss: {
            duration: 4000
          }
      })
    }
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
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
          href="https://fonts.googleapis.com/css2?family=Orbitron&family=Press+Start+2P&display=swap"
          rel="stylesheet"
      />
      <BaseContainer>
      <TerminalContainer>

        <p style={typewriterStyle}>
          <div id="header"> 
              <p> player@towers-vs-monsters:~/game$</p>
              <div id="cursor"> </div>
          </div>
      </p>

      </TerminalContainer>
        <FormContainer>
        <Title>Login</Title>
          <Form>
            <Label>Username</Label>
            <PasswordInputField
              placeholder="Enter username..."
              onChange={e => {
                this.handleInputChange('username', e.target.value);
              }}
            />
            <Label>password</Label>
            <PasswordInputField
              placeholder="Enter password..."
              onChange={e => {
                this.handleInputChange('password', e.target.value);
              }}
            />
            <ButtonContainer>
              <Button3
                disabled={!this.state.username || !this.state.password}
                width="50%"
                onClick={() => {
                  this.login();
                }}
              >
                Login
              </Button3>
              <Button3
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/registration`);
                  }}
              >
                Create new account!
              </Button3>
            </ButtonContainer>
          </Form>
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