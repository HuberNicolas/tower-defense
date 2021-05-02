import React, {Component} from "react"
import styled from "styled-components";

const StyledMinion = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height};
    background: ${props => props.background};
    border: 0px solid #aaa;
    border-radius: 16px;
    background-position: center center;
    background-size: 64px;
    background-color: ${props => props.color};
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
    z-index: 3;
    onClick: ${console.log("Spawn minions")};
`

class Minion extends React.Component {


    constructor() {
        super();
        this.state = {
            // attributes of a minion
            background: "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png')",
            color: "blue",
            width: "32px",
            height: "32px",
            layer: "",
        };
    }

    createMinion = (id) => {
        return <StyledMinion
            background={this.state.background} 
            color={this.state.color} 
            width={this.state.width} 
            height={this.state.height}
            left={"10000px"} // spawn from outside, need fix
            id={"m"+this.props.id}
            onClick={()=> {
                this.remove(id)
            }}> 
        
        </StyledMinion>
    }

    // still need improvement; does just change size
    remove = (minionId) => {
        console.log("removed minion")
        /* if(this.state.layer == "die") { } */ // check for specifit attributes
        this.setState({
            layer: "die",
            height: "0px",
            width: "0px",
            //color: "blue"
        })
    }
    render() {
        return (
            <div>
                {this.createMinion(this.state.id)}
            </div>
        )
    }
}
export default Minion