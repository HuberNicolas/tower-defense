import React from "react"
import styled from "styled-components";


const StyledTowerTile = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height}; 
    background: ${props => props.background};
    background-position: center center;
    background-color: ${props => props.color}; 
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
    z-index: 3;
`;

const TowerTile = (tile) => {
	return (
		<div>
            <StyledTowerTile background={tile.background} color={tile.color} width={tile.width} height={tile.height} left={tile.left} top={tile.top}></StyledTowerTile>
        </div>
	)
}

export default TowerTile