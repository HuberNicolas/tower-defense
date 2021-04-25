import React, {Component} from "react";

class Path extends Component {

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
        ctx.fillStyle = "brown";
        ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} id={"layer0"}/>
            </div>
        );
    }
}

export default Path