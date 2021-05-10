import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import { Button } from '../../views/design/Button';
import login from "../../login.jpg";

import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

var sectionStyle = {
  width: "100%",
  height: "768px",
  backgroundImage: "url(" +  login  + ")"
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


class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      username: null,
      password: null

    };
  }

  async register() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.post('/users', requestBody);

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
        <FormContainer>
        <Title>Registration</Title>
          <Form>
            <Label>Username</Label>
            <InputField
              placeholder="Enter new username..."
              onChange={e => {
                this.handleInputChange('username', e.target.value);
              }}
            />
            <Label>password</Label>
            <InputField
              placeholder="Enter new password..."
              onChange={e => {
                this.handleInputChange('password', e.target.value);
              }}
            />

            <ButtonContainer>
            <Button
              width="50%"
              onClick={() => {
                this.props.history.push(`/login`);
              }}
              >
                Back to login
              </Button>
              <Button
              disabled={!this.state.username || !this.state.password}
                width="50%"
                onClick={() => {
                  this.register();
                }}
              >
                Register!
              </Button>
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
