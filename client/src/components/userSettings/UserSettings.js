import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import { withRouter } from 'react-router-dom';
import { Button3 } from '../../views/design/Button3';

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
  font-family: 'Press Start 2P';
  color: yellow;
  text-align: center;
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

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class UserSettings extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      username: null,
      password: null,
      location: null
    };
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async submit() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        location: this.state.location,
        token: localStorage.getItem('token')
      });
      const response = await api.patch(`/users/profiles/${localStorage.getItem('token')}`, requestBody);

      // User settings changed successfully --> navigate back to /main
      this.props.history.push(`/main`);
    } catch (error) {
      store.addNotification({
        title: 'Error',
        width:300,
        height:100,
        message: `Something went wrong during editing the user settings: \n${handleError(error)}`,
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
          <FormContainer>
            <Title>User Settings</Title>
            <Form>
              <Label>Username</Label>
              <InputField
                  placeholder="Enter new username..."
                  onChange={e => {
                    this.handleInputChange('username', e.target.value);
                  }}
              />
              <Label>Password</Label>
              <PasswordInputField
                  placeholder="Enter new password.."
                  onChange={e => {
                    this.handleInputChange('password', e.target.value);
                  }}
              />
              <Label>Location</Label>
              <InputField
                  placeholder="Enter new location..."
                  onChange={e => {
                    this.handleInputChange('location', e.target.value);
                  }}
              />
              <ButtonContainer>
                <Button3
                    disabled={!this.state.username && !this.state.password && !this.state.location}
                    width="50%"
                    onClick={() => {
                      this.submit();
                    }}
                >
                  Submit
                </Button3>
              </ButtonContainer>
                <ButtonContainer>
                  <Button3
                      width="50%"
                      onClick={() => {
                        //this.login();
                        this.props.history.push(`/main`);
                      }}
                  >
                    Go back to main menu
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
export default withRouter(UserSettings);
