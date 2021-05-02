import React, {Component} from "react"
import styled from "styled-components";

const StyledShot = styled.div`
    background-color: ${props => props.shotColor};
    animation-duration: ${props => props.speed};
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
                    <StyledShot 
                        id={"shot"} 
                        shotColor={this.props.shotColor}
                        speed={this.props.speed}
                        top={this.props.top}
                        left={this.props.left}
                        onClick={console.log("clicked on projectile"+this.props.left)}
                        >
                    </StyledShot>

        )
    }
}
export default Shot