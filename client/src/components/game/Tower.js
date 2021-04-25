import React, {Component} from "react";

class Tower extends Component {

    state = {
        // size of minion canvas
        canvasWidth: 64,
        canvasHeight: 64
    }
    canvasRef = React.createRef();

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        // load the picture
        var tower = new Image();
        tower.onload = function() {
            ctx.drawImage(tower, -10, -10);
        };
        tower.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png';

        //ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} id={"layer3"}/>
            </div>
        );
    }
}

export default Tower