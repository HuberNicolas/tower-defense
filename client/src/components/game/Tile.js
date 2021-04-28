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

class Tile extends React.Component {
    render() {
	return (
		<div>
            <StyledTile background={this.props.background} color={this.props.color} width={this.props.width} height={this.props.height} left={this.props.left} top={this.props.top}></StyledTile>
        </div>
	)
}
}

export default Tile