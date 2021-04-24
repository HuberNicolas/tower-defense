import React, { useState, useCallback } from 'react';
import "./Game.css";


import { createBoard, checkCollision } from './gameHelpers';


// Componenets
import Board from './Board';
import Display from './Display';
import SpawnButton from './SpawnButton';
import MinionWave from './MinionWave';
import TowerShot from './TowerShots';
import Square from './Square';
import Field, { renderField, renderRow } from './Field';
import Grid from "./Grid";

// Custom Hooks
import { useWave } from './hooks/useWave';
import { useBoard } from './hooks/useBoard';
import { useInterval } from './hooks/useInterval';


const Game = () => {

    // define states
    const [currHP, setCurrHP] = useState(100);
    const [spawnRate, setSpawnRate] = useState(null); // drop time
    const [gameOver, setGameOver] = useState(false);

    const [wave, updateWavePos, resetWave] = useWave();
    const [board, setBoard] = useBoard(wave, resetWave); // 1h 20min
    // <Board board={createBoard()}/>

    // functions
    const decreaseHP = () => {
        setCurrHP(currHP - 1)
    }

    // movement

    const moveWave = dir => { // movePlayer
        updateWavePos({x: 0, y: 0});
    }

    const spawnWave = () => { // startGame
        // reset everything
        setSpawnRate(1000);
        setBoard(createBoard());
        resetWave();
    }

    const walk = () => { // drop
        if(!checkCollision(wave, board, {x: 0, y: 1})) {
            updateWavePos({x: 0, y: 1, collided: false });
        }
        else {
            updateWavePos({x: 0, y:0, collided: true});
        }
        
    }

    const walkPath = () => { // dropPlayer
        walk();
    }

    const move = ({ keyCode }) => {

    }

    useInterval(() => {
        walk();
    }, spawnRate)
    

    

    console.log("re-render")
    //console.log(createBoard());
    // 1366px x 768px

    var win = window,
    doc = document,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    x = win.innerWidth || docElem.clientWidth || body.clientWidth,
    y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    //alert(x + ' × ' + y);
    
    return(
        
        <div>
            

            <section class="statusbar">
                Statusbar
                <div>x:{x} y:{y}</div>
            </section>

            <section class="board">
                {/* Board */}
                <Grid></Grid>           
            </section>

            <section class="shop">
                Shop
            </section>
         </div>
    )
    
}

export default Game;