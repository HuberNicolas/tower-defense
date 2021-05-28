import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import { Button2 } from "../../views/design/Button2";
import { Button3 } from "../../views/design/Button3";
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


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
  height: 536px;
  border-style: solid;
  border-color: rgba(16, 89, 0, 1);
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
  marginTop: "120px",
  float: "left",
  width: "40%",

};

var colStyle1 = {
  marginLeft: "10%",
  marginTop: "120px",
  float: "left",
  width: "20%",
  borderStyle: "solid solid solid none",
  borderColor: "rgba(16, 89, 0, 1)",
};
const background = styled.img`
  display: flex;
  justify-content: center;
  backgroundimage: mainmenu;
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
          <div style={colStyle1}>
            <img src={tree} height="600px"></img>
          </div>
          <div style={colStyle}>
          
              <Title>Main Menu</Title>
              <ButtonContainer>
                <Button3
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/singleplayer`);
                  }}
                >
                  Singleplayer
                </Button3>
                <h1> </h1>
                {/* 
                <Button3
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/multiplayer`);
                  }}
                >
                  Multiplayer
                </Button3>
                <h1> 
                </h1>
                */}
                <Button3
                  width="50%"
                  onClick={() => {
                    this.props.history.push(`/settings`);
                  }}
                >
                  Edit User Settings
                </Button3>
                <h1> </h1>
                <Button3
                  width="50%"
                  onClick={() => {
                    this.logout();
                  }}
                >
                  logout
                </Button3>
                <h1> </h1>
                <Button3 width="50%" onClick={this.togglePlay}>
                  {this.state.play ? "Pause" : "Play"}
                </Button3>
              </ButtonContainer>

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
