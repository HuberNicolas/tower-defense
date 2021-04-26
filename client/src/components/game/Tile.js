import React from "react"
import styled from "styled-components";


const StyledTile = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height}; 
    background: ${props => props.background};
    background-position: center center;
    background-color: ${props => props.color}; 
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
`;

const Tile = (tile) => {
	return (
		<div>
            <StyledTile background={tile.background} color={tile.color} width={tile.width} height={tile.height} left={tile.left} top={tile.top}></StyledTile>
            <div>{tile.name}</div>
        </div>
	)
}

export default Tile