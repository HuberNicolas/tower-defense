import React, {Component} from "react";

class Minion extends Component {

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
        var minion = new Image();
        minion.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png';
        
        // scale picture down an put into canvas
        minion.onload = function () {

            // calculate width and height of the scaled image
            var wrh = minion.width / minion.height; // ratio
            var newWidth = canvas.width;
            var newHeight = newWidth / wrh;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * wrh;
              }
            // calculate offset
            var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
            var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
              // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
              ctx.drawImage(minion, xOffset, yOffset, newWidth, newHeight);
          };

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