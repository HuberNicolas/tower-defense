// General imports
import React, { useState, useCallback } from 'react';
import {withRouter} from "react-router-dom";
import "./styles/StyledGame.css";
import { useHistory } from 'react-router-dom';
import abc from "../../VOCALOID OriginalAgainGumi English.mp3";
// Componenets
import Grid from "./Grid";
import Wave from "./Wave";
import Path from "./Path"
import Tile from './Tile';
import {api, handleError} from "../../helpers/api";
import User from "../shared/models/User";
import async from "async";
import EmptyTile from "./EmptyTile";
import styled from "styled-components";
import Shot from './Shot';

// Custom Hooks
const StyledEmptyTile = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height}; 
    background: ${props => props.background};
    background-position: center center;
    background-color: ${props => props.color}; 
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
    z-index: 6;
`;


// this is for the M3-Tag

const Game = () => {

    // Define states
    const [currHP, setCurrHP] = useState(100);
    const [currGold, settCurrGold] = useState(5000);
    const [towerColor, setTowerColor] = useState(null);
    const [background, setBackground] = useState(null);
    const [color, setColor] = useState(null);
    const [cost, setCost] = useState(null);
    const [damage, setDamage] = useState(null);
    const [speed, setSpeed] = useState(null);

    // Functions
    const decreaseHP = () => {
        setCurrHP(currHP - 1)
    }

    const decreaseGold = () => {
        settCurrGold(currGold - 100)
    }

    const increaseGold = () => {
        settCurrGold(currGold + 100)
    }

    async function placeTower() {

    }

    function isCollide(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }

    const history = useHistory();

    async function quitGame() {
        try {
            const requestBody = JSON.stringify({
                gameId: localStorage.getItem('gameId'),
                token: localStorage.getItem('token')
            });
            const response = await api.patch(`/games/quits/${localStorage.getItem('gameId')}/${localStorage.getItem('token')}`, requestBody);

            // Remove game ID from local storage.
            localStorage.removeItem('gameId');

            // quit successfully worked --> navigate to the route /game in the GameRouter
            this.props.history.push(`/main`);
        } catch (error) {
            alert(`Something went wrong quitting the game: \n${handleError(error)}`);
        }
    }

    // Resolution
    // 1366px x 768px
    var win = window;
    var doc = document;
    var docElem = doc.documentElement;
    var body = doc.getElementsByTagName('body')[0];
    var x = win.innerWidth || docElem.clientWidth || body.clientWidth;
    var y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    //alert(x + ' × ' + y);
    console.log('current resolution : ' + x + ' × ' + y)

    return(
        <div>
            <section class="statusbar">
                Statusbar

                <section class="healthbar">
                    <div>{currHP} - {currGold} - Time {new Date().toLocaleTimeString()} - Weathercondition: {localStorage.getItem("weather")} -
                                                                                                            Gold: {localStorage.getItem("gold")} - {localStorage.getItem("weather") == "Sunny"? 'It is sunny' : 'It is not sunny'}</div>
                    {/* <button onClick={decreaseHP}>Decrease HP</button> */}

                    <button onClick={() => { history.push(`/main`);}} >Quit game</button>
                    <button >Spawn Minions</button>
                    <audio
                                                       autoPlay={true}
                                                       controls={true} >
                                                       <source type="audio/mp3" src={abc} />
                                                     </audio>


                    {/* <button onClick={decreaseGold}>Buy Tower</button> */}
                    {/* <button onClick={increaseGold}>Sell Tower</button> */}
                </section>
            </section>

            <section class="board">
                {/* Board */}
                <section class="grid">
                    {/* Render the Grid*/}
                    <Grid></Grid>
                    
                    {/* Set Path */}
                    {/* TOTAL LENGTH OF PATH: 43 TILES */ }
                    {/* 2 Down */}
                    <div style={{position : 'relative', left: '64px', top : '0px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '64px'}}><Path></Path></div>
                    
                    {/* 12 Right */}
                    <div style={{position : 'relative', left: '64px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '128px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '192px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '256px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '320px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '384px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '448px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '512px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '576px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '640px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '704px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '768px', top : '128px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '832px', top : '128px'}}><Path></Path></div>
                    
                    {/* 2 Down */}
                    <div style={{position : 'relative', left: '832px', top : '192px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '832px', top : '256px'}}><Path></Path></div>

                    {/* 7 Left */}
                    <div style={{position : 'relative', left: '768px', top : '256px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '704px', top : '256px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '640px', top : '256px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '576px', top : '256px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '512px', top : '256px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '448px', top : '256px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '384px', top : '256px'}}><Path></Path></div>

                    {/* 1 Down */}
                    <div style={{position : 'relative', left: '384px', top : '320px'}}><Path></Path></div>
                    
                    {/* 1 Left */}
                    <div style={{position : 'relative', left: '320px', top : '320px'}}><Path></Path></div>
                    
                    {/* 1 Down */}
                    <div style={{position : 'relative', left: '320px', top : '384px'}}><Path></Path></div>
                   
                    {/* 4 Left */}
                    <div style={{position : 'relative', left: '256px', top : '384px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '192px', top : '384px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '128px', top : '384px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '384px'}}><Path></Path></div>
                    
                    {/* 2 Down */}
                    <div style={{position : 'relative', left: '64px', top : '448px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '64px', top : '512px'}}><Path></Path></div>

                    {/* 8 Right */}
                    <div style={{position : 'relative', left: '128px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '192px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '256px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '320px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '384px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '448px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '512px', top : '512px'}}><Path></Path></div>
                    <div style={{position : 'relative', left: '576px', top : '512px'}}><Path></Path></div>

                    {/* 1 Down */}
                    <div style={{position : 'relative', left: '576px', top : '576px'}}><Path></Path></div>


            
                    {/* Place empty Tiles for Towers */}
                    {/* Empty Tiles 1st row (14 entries, 1 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile> 
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"128px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"256px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"320px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"384px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"448px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"512px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"576px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"832px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"0px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 2nd row (14 entries, 1 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"128px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"256px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"320px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"384px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"448px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"512px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"576px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"832px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"64px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 3rd row (2 entries, 13 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"128px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"128px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 4th row (14 entries, 1 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"64px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"128px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"256px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"320px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"384px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"448px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"512px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"576px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"192px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 5th row (7 entries, 8 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"256px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"64px"} top={"256px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"128px"} top={"256px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"256px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"256px"} top={"256px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"320px"} top={"256px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"256px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 6th row (13 entries, 2 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"64px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"128px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"256px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"448px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"512px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"576px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"832px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"320px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 7th row (10 entries, 5 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"384px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"448px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"512px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"576px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"832px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"384px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 8th row (14 entries, 1 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"128px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"256px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"320px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"384px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"448px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"512px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"576px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"832px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"448px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 9th row (6 entries, 9 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"512px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"512px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"512px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"512px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"832px"} top={"512px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"512px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>

                    {/* Empty Tiles 10th row (14 entries, 1 empty for path) */}
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"0px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"64px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"128px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"192px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"256px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"320px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"384px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"448px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"512px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"640px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"704px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"768px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"832px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                    <EmptyTile color={""} width={"64px"} height={"64px"} left={"896px"} top={"576px"} towerColor={towerColor} background={background} speed={speed}></EmptyTile>
                                        
                    {/* Spawn Wave*/}
                    <Wave waveSize={21}></Wave>
                   
                    {/* Experimental*/}
                    {/* <TowerTile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png')"} color={"green"} width={"64px"} height={"64px"} left={"640px"} top={"448px"}></TowerTile> */}
                </section>
            </section>

            <section class="shop">
                Shop
                {/* Towers in Shop*/}
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png')"} color={"yellow"} width={"64px"} height={"64px"} left={"62px"} top={"50px"} onClick={() => {setTowerColor("yellow")}} onClick={() => {setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png')");}}></Tile>    
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png')"} color={"orange"} width={"64px"} height={"64px"} left={"190px"} top={"50px"} onClick={() => setTowerColor("orange")} onClick={() => setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png')")}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png')"} color={"red"} width={"64px"} height={"64px"} left={"62px"} top={"250px"} onClick={() => setTowerColor("red")} onClick={() => setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png')")}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png')"} color={"blue"} width={"64px"} height={"64px"} left={"190px"} top={"250px"} onClick={() => setTowerColor("blue")} onClick={() => setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png')")}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png')"} color={"green"} width={"64px"} height={"64px"} left={"62px"} top={"450px"} onClick={() => setTowerColor("green")} onClick={() => setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png')")}></Tile>
                <Tile background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png')"} color={"purple"} width={"64px"} height={"64px"} left={"190px"} top={"450px"} onClick={() => setTowerColor("purple")} onClick={() => setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png')")}></Tile>
                
                {/* Towers on Board*/}
                <StyledEmptyTile width={"64px"} height={"64px"} left={"62px"} top={"50px"} onClick={() => {setTowerColor("yellow"); {setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png')")}; {setCost(100)}; {setDamage(10)}; {setSpeed("1s")}; }} ></StyledEmptyTile>
                <StyledEmptyTile width={"64px"} height={"64px"} left={"190px"} top={"50px"} onClick={() => {setTowerColor("orange"); {setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/146.png')")}; {setCost(200)}; {setDamage(20)}; {setSpeed("2s")}; }} ></StyledEmptyTile>
                <StyledEmptyTile width={"64px"} height={"64px"} left={"62px"} top={"250px"} onClick={() => {setTowerColor("red"); {setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/250.png')")}; {setCost(300)}; {setDamage(30)}; {setSpeed("1.5s")}; }} ></StyledEmptyTile>
                <StyledEmptyTile width={"64px"} height={"64px"} left={"190px"} top={"250px"} onClick={() => {setTowerColor("blue"); {setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/249.png')")}; {setCost(400)}; {setDamage(40)}; {setSpeed("0.5s")}; }} ></StyledEmptyTile>
                <StyledEmptyTile width={"64px"} height={"64px"} left={"62px"} top={"450px"} onClick={() => {setTowerColor("green"); {setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png')")}; {setCost(500)}; {setDamage(50)}; {setSpeed("2s")}; }} ></StyledEmptyTile>
                <StyledEmptyTile width={"64px"} height={"64px"} left={"190px"} top={"450px"}  onClick={() => {setTowerColor("purple"); {setBackground("url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/65.png')")}; {setCost(600)}; {setDamage(60)}; {setSpeed("1s")}; }} ></StyledEmptyTile>
                
                {/* Infoboard */}
                {towerColor !== null && <p style={{marginTop: 530, marginLeft: 55, color:"whitesmoke"}}> <b> Selected tower: {towerColor} tower <br/> Damage: {damage} HP <br/> Cost: {cost} </b></p>}
            </section>
         </div>
    )
}
export default Game;