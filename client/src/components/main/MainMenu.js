import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import { Button2 } from "../../views/design/Button2";
import mainmenu from "../../mainmenu.jpg";
import backgroundmusic from "../../backgroundmusic.mp3";
import { api, handleError } from "../../helpers/api";
import { store } from "react-notifications-component";
import tree from "../../assets/img/Tree2.png";

import "react-notifications-component/dist/theme.css";
import "animate.css";

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
    color: rgba(255, 255, 255, 1);
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
  font-family: "Press Start 2P";
  font-weight: bold;
  color: yellow;
  text-align: center;
`;
var sectionStyle = {
  width: "100%",
  height: "768px",
  //backgroundImage: "url(" +  mainmenu  + ")",
};

var rowStyle = {};

var colStyle = {
  float: "right",
  margin: "60px",
  width: "40%",
};
const background = styled.img`
  display: flex;
  justify-content: center;
  backgroundimage: mainmenu;
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
      play: false,
    };
  }

  // music to be played
  audio = new Audio(backgroundmusic);
  componentDidMount() {
    this.audio.addEventListener("ended", () => this.setState({ play: false }));
  }

  componentWillUnmount() {
    this.audio.removeEventListener("ended", () =>
      this.setState({ play: false })
    );
  }

  togglePlay = () => {
    this.setState({ play: !this.state.play }, () => {
      this.state.play ? this.audio.play() : this.audio.pause();
    });
  };
  //refreshes the website
  reload() {
    window.location.reload(false);
  }
  //logout removes your token
  async logout() {
    try {
      const requestBody = JSON.stringify({
        token: localStorage.getItem("token"),
      });
      await api.patch("/users/", requestBody);

      localStorage.clear();
      this.props.history.push("/login");
    } catch (error) {
      store.addNotification({
        title: "Error",
        width: 300,
        height: 100,
        message: `Something went wrong while trying to log out: \n${handleError(
          error
        )}`,
        type: "warning",
        container: "top-left",
        animationIn: ["animated", "fadeIn"],
        animationOut: ["animated", "fadeOut"],
        dismiss: {
          duration: 3000,
        },
      });
    }
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  render() {
    return (
      <div style={sectionStyle}>
        <div>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Orbitron&family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />
        </div>
        <div style={rowStyle}>
          <div style={colStyle}>
            <img src={tree} height="600px"></img>
          </div>
          <div style={colStyle}>
          <BaseContainer>
              <Title>Main Menu</Title>
              <ButtonContainer>
                <Button2
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/singleplayer`);
                  }}
                >
                  Singleplayer
                </Button2>
                <h1> </h1>
                {/* 
                <Button2
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/multiplayer`);
                  }}
                >
                  Multiplayer
                </Button2>
                <h1> 
                </h1>
                */}
                <Button2
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/settings`);
                  }}
                >
                  Edit User Settings
                </Button2>
                <h1> </h1>
                <Button2
                  width="50%"
                  onClick={() => {
                    this.logout();
                  }}
                >
                  logout
                </Button2>
                <h1> </h1>
                <Button2 width="50%" onClick={this.togglePlay}>
                  {this.state.play ? "Pause" : "Play"}
                </Button2>
              </ButtonContainer>
            </BaseContainer>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Login);
