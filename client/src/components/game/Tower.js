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
        tower.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png';

        // scale picture down an put into canvas
        tower.onload = function () {

            // calculate width and height of the scaled image
            var ratio = tower.width / tower.height; // ratio
            var newWidth = canvas.width;
            var newHeight = newWidth / ratio;
            if (newHeight > canvas.height) {
                newHeight = canvas.height;
                newWidth = newHeight * ratio;
              }
            // calculate offset
            var xOffset = newWidth < canvas.width ? ((canvas.width - newWidth) / 2) : 0;
            var yOffset = newHeight < canvas.height ? ((canvas.height - newHeight) / 2) : 0;
              // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
              ctx.drawImage(tower, xOffset, yOffset, newWidth, newHeight);
          };

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