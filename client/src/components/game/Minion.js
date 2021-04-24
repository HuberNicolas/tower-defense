import React, {Component} from "react";

class Minion extends Component {

    state = {
        canvasWidth: 64,
        canvasHeight: 64
    }
    canvasRef = React.createRef();

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext('2d');

        ctx.fillRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight}/>
            </div>
        );
    }
}

export default Minion