import React, {Component} from "react";

class Grid extends Component {

    state = {
        // size of grid canvas
        canvasWidth: 960,
        canvasHeight: 640
    }
    canvasRef = React.createRef();

    componentDidMount() {
        const canvas = this.canvasRef.current;
        var ctx = canvas.getContext("2d");

        // horicontal: 15 lines
        for(var i = 0; i<16; i++) {
            // draw from y = 0 (top) to y = 640 (bottom)
            ctx.moveTo(64*i, 0);
            ctx.lineTo(64*i, 640);
            ctx.stroke();
        }

        // vertical: 10 lines
        for(var i = 0; i<11; i++) {
            // draw from x = 0 (left) to x = 960 (right)
            ctx.moveTo(0, 64*i);
            ctx.lineTo(960, 64*i);
            ctx.stroke();
        }
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} id={"layer1"}/>
            </div>
        );
    }
}

export default Grid