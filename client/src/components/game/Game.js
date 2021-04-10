import React, { useState, useCallback } from 'react';
import "./Game.css";

import { createBoard, checkCollision } from './gameHelpers';


// Componenets
import Board from './Board';
import Display from './Display';
import SpawnButton from './SpawnButton';

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
    console.log(createBoard());
    return(
        
        <div>
            <section id="grid">
                <header>
                    <h3> Statusbar </h3>
                    <div>
                        <div>{currHP}</div>
                        <button onClick={decreaseHP}> Decrease HP </button>

                    </div>
                </header>
                    
                <nav>
                        <h1> Shop </h1>
                        <aside>
                            <Display text="Info1" />
                            <Display text="Info2" />
                            <Display text="Info3" />
                        </aside>

                </nav>
                
                <main>
                    <h1>Gameboard</h1>
                    <Board board={board}/>
                    
                    <SpawnButton callback={spawnWave}/>
                    
                
                </main>
             </section>
         </div>
    )
    
}

export default Game;