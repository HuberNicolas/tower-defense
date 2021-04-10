import React from 'react';
import { StyledDisplay } from './styles/StyledDisplay';

const Display = ({ gameOver, text}) => (
    <StyledDisplay gameOver={gameOver}>{text}</StyledDisplay>
    //<div> {text} </div>
)

export default Display;