import React, {Component} from "react"
import styled from "styled-components";
import Minion from "./Minion";
import Tile from "./Tile";



const StyledMonster = styled.canvas`
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

class Monster extends React.Component {

    constructor() {
        super();
        this.state = {
            width: false,
            height: false,
            color: false,
            red : true,
            background: null,
        };
    }


    render() {
        
        return (
            <div>
                <div> Hi </div>
                <StyledMonster 
                                            color={this.props.color}
                                            background={this.props.background}  
                                            width={this.props.width} 
                                            height={this.props.height}
                                            left={this.props.left}
                                            top={this.props.top}
                                            onClick={() => { 
                                                console.log("Clicked on monster")
                                                console.log(this.props.height)
                                                this.setState({ color: this.props.color});
                                                this.changeColor.bind(this)
                                            }} 
                                            > 

                </StyledMonster>
               
            </div>) 

    }

}
export default Monster