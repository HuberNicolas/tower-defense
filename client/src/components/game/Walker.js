import React from "react"
import styled from "styled-components";


const StyledWalker = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height}; 
    background: ${props => props.background};
    background-position: center center;
    background-color: ${props => props.color}; 
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
`;

const Walker = (walker) => {
	return (
		<div>
            <StyledWalker background={walker.background} color={walker.color} width={walker.width} height={walker.height} left={walker.left} top={walker.top}> </StyledWalker>
        </div>
	)
}

export default Walker