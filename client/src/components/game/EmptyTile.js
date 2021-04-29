import React, {Component} from "react"
import styled from "styled-components";
import Tile from "./Tile";



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
        };
    }
    render() {
        return (
            <div>
                {(!this.state.clicked || this.state.color === null) ? (
                    <div>
                        
                        <StyledEmptyTile    color={this.props.color} 
                                            width={this.props.width} 
                                            height={this.props.height}
                                            left={this.props.left}
                                            top={this.props.top} 
                                            onClick={() => {
                                                console.log("Clicked on empty Tile") 
                                                this.setState({clicked: true, background: this.props.background, color: this.props.towerColor});
                                            }} 
                                            onDragEnd={() => {
                                                this.setState({dropped: true});
                                            }}>
                        </StyledEmptyTile>
                    </div>) : (
                    <div>
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
                </div>)
                }
            </div>
        )
    }

// componentDidMount() {
//     window.addEventListener('mouseup', this._onDragLeave);
//     window.addEventListener('dragenter', this._onDragEnter);
//     window.addEventListener('dragover', this._onDragOver);
//     window.addEventListener('dragend', this._onDragEnd);
//     window.addEventListener('drop', this._onDrop);
//     document.getElementById('dragbox').addEventListener('dragleave', this._onDragLeave);
// }
}
export default EmptyTile