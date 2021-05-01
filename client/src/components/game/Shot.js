import React, {Component} from "react"
import styled from "styled-components";
import Tile from "./Tile";




const StyledShot = styled.div`
    background-color: ${props => props.color};
    animation-duration: ${props => props.duration};
    position: relative;
    top: ${props => props.top};
    left: ${props => props.left};
`

class Shot extends React.Component {
    constructor() {
        super();
        

    }
    render() {
        return (
                    <StyledShot id={"shot"} 
                        color={this.props.color}
                        duration={this.props.duration} 
                        top={this.props.top}
                        left={this.props.left}
                        
                        
                        
                        >
                    </StyledShot>

        )
    }


}
export default Shot