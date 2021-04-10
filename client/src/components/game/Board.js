import React from 'react';
import { StyledBoard } from './styles/StyledBoard';
import Tile from './Tile';

const Board = ({ board }) => (
    <StyledBoard width={board[0].length} height={board.length}>
        {board.map(row => row.map((tile, x) => <Tile key={x} type={tile[0]} />))}     
    </StyledBoard>
    
   /* 
   <div> 
       {board.map(row => row.map((tile, x) => <Tile key={x} type={tile[0]} />))}
    </div>
    */
)

export default Board;