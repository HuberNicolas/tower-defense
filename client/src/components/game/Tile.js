import React from 'react';
import { StyledTile } from './styles/StyledTile';
import { MINIONS } from './minions';


const Tile = ({ type } ) => (
    //<div> Tile </div>
    <StyledTile type={type} color={MINIONS[type].color} />
    //<StyledTile type={type} color={MINIONS['B'].color} />
    
)

export default Tile;