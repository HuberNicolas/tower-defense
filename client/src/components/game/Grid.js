import React, {Component} from "react";

class Sample extends Component {

    state = {
        canvasWidth: 1200,
        canvasHeight: 668
    }
    canvasRef = React.createRef();

    componentDidMount() {
        const canvas = this.canvasRef.current;
        var ctx = canvas.getContext("2d");

        // horicontal
        for(var i = 0; i<120; i++) {
            ctx.moveTo(10*i, 0);
            ctx.lineTo(10*i, 668);
            ctx.stroke();
        }

        // vertical
        for(var i = 0; i<100; i++) {
            ctx.moveTo(0, 10*i);
            ctx.lineTo(1200, 10*i);
            ctx.stroke();
        }
    }

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight}/>

            </div>
        );
    }
}

export default Sample