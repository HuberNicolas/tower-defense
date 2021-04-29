import React, {Component} from "react"
import styled from "styled-components";
import Tile from "./Tile";



const StyledColorChange = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height};
    background: ${props => props.background};
    background-position: center center;
    background-color: ${props => props.color};
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
    z-index: 3;
`

class ColorChange extends React.Component {

    constructor() {
        super();
        this.state = {
            background: "",
            color: "blue",
            width: "64px",
            height: "64px"
        };
    }

    change = (e) => {
        this.setState({
            color: "red",
            width: "64px",
            height: "64px"
        })

    }
    render() {
        return (<div>
                <StyledColorChange color={this.state.color} width={this.state.width}height={this.state.height} left={this.props.left} top={this.props.top}
                onClick={() => {this.change()}}>
                </StyledColorChange>
            </div>
        )
    }


}
export default ColorChange