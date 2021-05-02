import React, {Component} from "react"
import styled from "styled-components";
import Tile from "./Tile";
import Shot from "./Shot";

const StyledEmptyTile = styled.canvas`
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

class EmptyTile extends React.Component {

    constructor() {
        super();
        this.state = {
            clicked: false,
            dropped: false,
            background: null,
            color: null,
            speed: null,
        };
    }
    render() {
        // compute coordinates for new shot
        let topval = `calc(${this.props.top} + 32px)`
        let leftval = `calc(${this.props.left} + 32px)`
        return (
            <div>
                {(!this.state.clicked || this.state.color === null) ? (
                    <div>
                        {/* Select a tower from the shop and "save" information */}
                        <StyledEmptyTile    color={this.props.color}
                                            speed={this.props.speed} 
                                            width={this.props.width} 
                                            height={this.props.height}
                                            left={this.props.left}
                                            top={this.props.top} 
                                            onClick={() => {
                                                console.log("Clicked on empty Tile") 
                                                this.setState({clicked: true, background: this.props.background, color: this.props.towerColor, speed: this.props.speed});
                                            }} 
                                            onDragEnd={() => {
                                                this.setState({dropped: true});
                                            }}>
                        </StyledEmptyTile>
                    </div>) : (
                    <div>
                        {/* Place a tower */}
                        <Tile   background={this.background} 
                                color={this.color} 
                                width={this.props.width}
                                height={this.props.height} 
                                left={this.props.left}
                                top={this.props.top} 
                                onClick={() => {
                                    console.log("Clicked on Tile") 
                                }} 
                                {...this.state}>
                        </Tile>
                        <Shot 
                            shotColor={this.state.color} 
                            top={topval} 
                            left={leftval}
                            speed={this.state.speed}>  
                        </Shot>
                </div>)
                }
            </div>
        )
    }
}
export default EmptyTile