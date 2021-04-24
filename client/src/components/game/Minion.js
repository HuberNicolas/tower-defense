import React, {Component} from "react";
import "./StyledMinion.css"


class Minion extends Component {

    state = {
        canvasWidth: 64,
        canvasHeight: 64
    }
    canvasRef = React.createRef();

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        // load the picture
        var minion = new Image();
        minion.onload = function() {
            ctx.drawImage(minion, 1, 1);
        };
        minion.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png';

        //ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} id={"layer2"}/>
            </div>
        );
    }
}

export default Minion