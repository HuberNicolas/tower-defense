# SoPra FS21 - Client Template

## Getting started with React

Read and go through those Tutorials, It will make your life easier!

- Read the React [Docs](https://reactjs.org/docs/getting-started.html)
- Do this React [Getting Started](https://reactjs.org/tutorial/tutorial.html) Tutorial (it doesn’t assume any existing React knowledge)
- Get an Understanding of [CSS](http://localhost:3000) and [HTML](https://www.w3schools.com/html/html_intro.asp)!

Once you have done all of this, in the template there are two main external dependencies that you should look at:

- [styled-components](https://www.styled-components.com/docs)
  It removes the mapping between components and styles (i.e. external css files). This means that when you're defining your styles, you're actually creating a normal React component, that has your styles attached to it
* [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start) Declarative routing for React being a collection of navigational components that compose declaratively with your application. 
* [react-hooks](https://reactrouter.com/web/api/Hooks) Let's you access the state of the router and perform navigation from inside your components.



## Prerequisites and Installation

For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org). All other dependencies including React get installed with:

### `npm install`

This has to be done before starting the application for the first time (only once).

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console (use Google Chrome!).

### `npm run test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into an 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).


>Thanks to Lucas Pelloni for the template



## Introduction
The aim of our project was to build a 2D-Towerdefense game. In case you don't know the genre yet, [here is a nice video](https://datasaurus-rex.com/inspiration/storytelling/tower-defense-games-explained), that explains the most important aspects. Furthermore, the application has to consist of a front-end and back-end, which are usign the REST-protocol. In addtion to this, an external API has to be used, too.

## Technologies (short)
For the front end, we used the React Framework. With React, there was also CSS, HTML and Java Script a big part of the project. The core of the game was written in Java Script. The backbone of the game application is based on the Canvas API. Using Canvas allowed us to handle all different objects individually (for instance projectilies.) and this was crucial for the collision detection between the game objects. If you are interested, Mozilla Web Docs (MDN) has a very good [documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## High-level components

In the front-end, backbone of the application is the [Game.js](/public/components/game/Game.js) file.


## Launch & deployment


Make sure you run 

### `npm install --save react-notifications-component animate.css`
### `npm install react-typewriter`

before you build and run the application. You might also need to run

### `npm audit fix`

### Illustrations

### Roadmap
Here is a list with ideas to improve/extend the project further:
- Adding a Multiplayer (and/or design an AI such that you can play vs. the computer)
- Implement the originally idea, where 2 (or even more?) players are in a game. Besides that you can buy and place towers, each player also can spend money for buying minions. These minions will be sent to the opponents board. This would add a new layer of tactical decisions.
- Adding more maps (and/or write a mapgenerator)
- Adding more towers/minions (this would also need a lot of balancing)
- Implementing a range-indicator and minion-detector for the towers. This would increse the diffuculty of the game.


### Authors and acknowledment
This project was created during the "Softwarepraktikum" Sopra at the University of Zürich (UZH) in the Spring Semester 21. The core of the team was:
- Nicolas Blumer, Nicolas Huber and Michael Vuong

We would also like to mention that the project started initially among Louis Huber and Omar Abo Hamida. Due to their high workload, they decided to leave the group after the inital assessment. Nevertheless, thank you Louis and Omar for your initial support!

After this assessment, Matej Gurica and Mauro Dörig joined our team. Unfortunately, Matej and Mauro also decided to leave the project after a couple of weeks (between M3 and M4). Anyway, thank you 2 for your effort.


### License

GNU General Public License v3.0
