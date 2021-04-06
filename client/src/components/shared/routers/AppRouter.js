import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import MainMenu from "../../main/MainMenu";
import Registration from "../../registration/Registration";
import Title from "../../title/Title";
import UserSettings from "../../userSettings/UserSettings";
import Singleplayer from "../../singleplayer/Singleplayer";
import Multiplayer from "../../multiplayer/Multiplayer";
import Game from "../../game/Game";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>
             {/* <Route
              path="/game"
              render={() => (
                <GameGuard>
                  <GameRouter base={"/game"} />
                </GameGuard>
              )}
            /> */}
            <Route
              path="/login"
              exact
              render={() => (
                <LoginGuard>
                  <Login />
                </LoginGuard>
              )}
            />
              {/* # */}
              <Route
                  path="/main"
                  exact
                  render={() => (
                      <MainMenu />
                  )}
              />
              {/* # */}
              <Route
                  path="/registration"
                  exact
                  render={() => (
                      <Registration />
                  )}
              />
              {/* # */}
              <Route
                  path="/title"
                  exact
                  render={() => (
                      <Title />
                  )}
              />
              {/* # */}
              <Route
                  path="/settings"
                  exact
                  render={() => (
                      <UserSettings />
                  )}
              />
              {/* # */}
              <Route
                  path="/singleplayer"
                  exact
                  render={() => (
                      <Singleplayer />
                  )}
              />
              {/* # */}
              <Route
                  path="/multiplayer"
                  exact
                  render={() => (
                      <Multiplayer />
                  )}
              />
              {/* # */}
              <Route
                  path="/game"
                  exact
                  render={() => (
                      <Game />
                  )}
              />

              {/* Entry point */}
            <Route path="/" exact render={() => <Redirect to={"/title"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default AppRouter;
