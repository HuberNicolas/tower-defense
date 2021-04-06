import React, {Component} from 'react';
import Tile from "./Tile";



class Board extends Component {

    render() {
        return(
            <canvas id={"canvas"} width={"50px"} height={"50px"} />
        );
    }
}

export default Board;