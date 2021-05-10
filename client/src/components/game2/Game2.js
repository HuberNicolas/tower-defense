import React, { forwardRef } from 'react';

class Game2 extends React.Component {
  state = {
    // size of board canvas
    canvasWidth: 960,
    canvasHeight: 704
}
canvasRef = React.createRef();

componentDidMount() {

    // canvas initialisation
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');

    // global variable
    const tileSize = 64;
    const tileGap = 3;
    let minionsInterval = 600;
    let frame = 0;

    const gameGrid = []; // all cells
    const towers = []; // all towers
    const pathTiles = []; // all paths
    const minions = []; // all minions
    const minionPosition = [];
    const projectiles = []; // all shots

    // status bar
    let score = 0;
    let HP = 12300000;
    let gold = 30000;
    let gameOver = false;

    const statusBarHeight = 112; // proportions


    // game board
    const controlsBar = {
        width: canvas.width, // board width
        height: tileSize 
    }

    const mouse = {
        x: 10,
        y: 10,
        width : 0.1,
        height: 0.1,
    }
    
    let canvasPosition = canvas.getBoundingClientRect();
    //console.log(canvasPosition);
    

    // EventListeners
    canvas.addEventListener('mousemove', function(e) {
        mouse.x = e.x - canvasPosition.left;
        mouse.y = e.y - canvasPosition.top;
    });

    canvas.addEventListener('mouseleave', function() {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    canvas.addEventListener('click', function() {
        const gridPositionX = mouse.x - (mouse.x % tileSize) + tileGap;
        const gridPositionY = mouse.y - (mouse.y % tileSize) + tileGap;
        console.log("click")
        if (gridPositionY < tileSize) return; // clicked on statusbar
        

        for (let i = 0; i < pathTiles.length; i++) {
            console.log(pathTiles[i].x)
            if (pathTiles[i].x == gridPositionX && pathTiles[i].y == gridPositionY) { return; }
        }

        // check if there is already a Tower

        for (let i = 0; i < towers.length; i++) {
            if (towers[i].x == gridPositionX && towers[i].y == gridPositionY) { return; }
        }
        let towerCost = 100;
        if(gold >= towerCost) {
            towers.push(new Tower(gridPositionX, gridPositionY));
            gold -= towerCost;
        }

    });

    // fixed bug when resizing
    window.addEventListener('resize', function() {
        canvasPosition = canvas.getBoundingClientRect();
    })


    // ENTITIES

    class Tile {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = tileSize;
            this.height = tileSize;
        }
        draw() {
            if (collision(this, mouse)) {
                // highlight current tile
                ctx.strokeStyle = 'black';
                ctx.strokeRect(this.x, this.y, this.width, this.height)
            }
            
        }
    }

    function createGrid() {
        for (let y = tileSize; y < canvas.height; y += tileSize) {
            for (let x = 0; x < canvas.width; x += tileSize) {
                gameGrid.push(new Tile(x, y));
            }
        }
    }

    class Path {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = tileSize;
            this.height = tileSize; // prevents from collisions from the edges
            this.free = false;
        }

        draw() {
            ctx.fillStyle = 'brown';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    function createPath() {

        for  (let k = 1; k <= 3; k++) {
            pathTiles.push(new Path(1*tileSize, k*tileSize));
        }

        for  (let k = 2; k <= 13; k++) {
            pathTiles.push(new Path(k*tileSize, 3*tileSize));
        }

        for  (let k = 4; k <= 5; k++) {
            pathTiles.push(new Path(13*tileSize, k*tileSize));
        }

        for  (let k = 13; k >= 6; k--) {
            pathTiles.push(new Path(k*tileSize, 5*tileSize));
        }

        for  (let k = 6; k >= 5; k--) {
            pathTiles.push(new Path(k*tileSize, 6*tileSize));
        }

        for  (let k = 5; k >= 1; k--) {
            pathTiles.push(new Path(k*tileSize, 7*tileSize));
        }

        for  (let k = 8; k <= 9; k++) {
            pathTiles.push(new Path(1*tileSize, k*tileSize));
        }

        for  (let k = 2; k <= 10; k++) {
            pathTiles.push(new Path(k*tileSize, 9*tileSize));
        }

        pathTiles.push(new Path(10*tileSize, 10*tileSize))
    }

    class Tower {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = tileSize - tileGap * 2;
            this.height = tileSize - tileGap * 2; // prevents from collisions from the edges
            this.shooting = true;
            this.health = 100;
            this.projectiles = [];
            this.timer = 0;
        }

        draw() {
            ctx.fillStyle = 'green';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle = 'gold';
            ctx.font = '20px Arial';
            ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 25);
        }

        update() {
            this.timer++;
            if(this.timer % 100 === 0) {
                projectiles.push(new Projectiles(this.x + 70, this.y + 25))
            }
            
        }
    }

    class Minion {
        constructor(verticalPosition) {
            //this.x = canvas.width;
            //this.y = verticalPosition;
            this.x = tileSize; // spawn point
            this.y = verticalPosition; // spawn point
            this.width = tileSize - tileGap * 2;
            this.height = tileSize - tileGap * 2;
            this.speed = Math.random() * 0.1 + 3;
            this.movement = this.speed;
            this.health = 100;
            this.maxHealth = this.health; 
        }
        update() {
            if (this.y < 193) {
                this.y += this.movement;
            }
            if (this.y > 190.8 && this.y < 198 && this.x < 838) {
                this.x += this.movement;
            }
            if (this.y > 193 && this.y < 323 && this.x > 832.8 && this.x < 841) {
                this.y += this.movement;
            }
            if (this.y > 320.8 && this.y < 328 && this.x > 388) {
                this.x -= this.movement;
            }
            if (this.y > 320.8 && this.y < 385 && this.x > 383 && this.x < 393.2) {
                this.y += this.movement;
            }
            if (this.y > 382.8 && this.y < 390 && this.x > 326 && this.x < 393.2) {
                this.x -= this.movement;
            }
            if (this.y > 382.8 && this.y < 449 && this.x > 321 && this.x < 326) {
                this.y += this.movement;
            }
            if (this.y > 449 && this.y < 454 && this.x > 65 && this.x < 326) {
                this.x -= this.movement;
            }
            if (this.y > 449 && this.y < 577 && this.x > 60 && this.x < 72) {
                this.y += this.movement;
            }
            if (this.y > 576 && this.y < 582 && this.x > 55 && this.x < 640) {
                this.x += this.movement;
            }
            if (this.y > 576 && this.x > 639) {
                this.y += this.movement;
            }
        }
        draw() {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(this.x+this.width/2, this.y+this.width/2, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            //ctx.fillStyle = 'red';
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillStyle= 'black';
            ctx.font = '30px Arial';
            ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 25);
        }
    }
    
    class Projectiles {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 10;
            this.power = 20;
            this.speed = 5;
        }

        update() {
            this.x += this.speed;
        }

        draw() {
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // handlers

    function handleGameStatus() {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Gold: ' + gold , 20, 55);
        ctx.fillText('Score: ' + score, 220, 55);
        ctx.fillText('HP: ' + HP, 420, 55);

        if (gameOver) {
            ctx.fillStyle = 'green';
            ctx.font = '30px Arial';
            ctx.fillText("Gameover" , 350, 350); 
        }
    }

    function handleGameGrid() {
        for (let i = 0; i < gameGrid.length; i++) {
            gameGrid[i].draw();
        }
    }

    function handlePath() {
        for (let i = 0; i < pathTiles.length; i++) {
            pathTiles[i].draw();
        }
    }


    function handleTowers() {
        for (let i = 0; i < towers.length; i++) {
            towers[i].draw();
            towers[i].update();

            for (let j = 0; j < minions.length; j++) {
                if (towers[i] && collision(towers[i], minions[j])) {
                    minions[j].movement = 0;
                    towers[i].health -= 0.2;
                }
                if (towers[i] && towers[i].health <= 0) {
                    towers.splice(i, 1);
                    i--;
                    minions[j].movement = minions[j].speed;
                }
            }
        }
    }

    function handleMinions() {
        for (let i = 0; i < minions.length; i++) {
            minions[i].update();
            minions[i].draw();
            if (minions[i].y > 704 && minions[i].y < 708.4) {
                HP -= minions[i].maxHealth;
                //gameOver = true;
                console.log(gameOver);
            }
            if (minions[i].health <= 0) {
                let reward = minions[i].maxHealth/10;
                gold += reward;
                score += reward;
                const findThisIndex = minionPosition.indexOf(minions[i].y); // find the first occuring
                minionPosition.splice(findThisIndex, 1);
                minions.splice(i, 1);
                i--;
                console.log(minionPosition);
            }
        }

        if (frame % minionsInterval === 0) {
            //let verticalPosition = Math.floor(Math.random() * 5 + 1 ) * tileSize + tileGap; // spawn randomly
            let verticalPosition = 1 * tileSize + tileGap;
            minions.push(new Minion(verticalPosition));
            minionPosition.push(verticalPosition); // one number for each activ number
            if (minionsInterval > 120) minionsInterval -= 50;
            console.log(minionPosition);    
        }
    }

    function handleProjectiles() {
        for (let i = 0; i < projectiles.length; i++) {
            projectiles[i].update();
            projectiles[i].draw();

            for (let j = 0; j < minions.length; j++) {
                if (minions[j] && projectiles[i] && collision(projectiles[i], minions[j])) { // both existing and is hit?
                    minions[j].health -= projectiles[i].power;
                    projectiles.splice(i, 1);
                    i--;
                }
            }

            if (projectiles[i] && projectiles[i].x > canvas.width - tileSize) {
                projectiles.splice(i, 1); // remove
                i--; // adjust for loop index
            }
            //console.log('projectiles ' + projectiles.length);   
        }
    }

    // animmation function

    function animate() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = 'blue'
        ctx.fillRect(0,0,controlsBar.width, controlsBar.height);
    
        frame++;
       
        //console.log(frame);
        
        if(!gameOver) {
            requestAnimationFrame(animate);
        }
        handleGameStatus();
        handleGameGrid();
        handlePath();
        handleTowers();
        handleProjectiles();
        handleMinions();
    }

    // actual sequence

    createGrid();
    createPath();
    animate();


    // Helper functions

    function collision(first, second) {
        if (    !(  first.x > second.x + second.width ||
                    first.x + first.width < second.x ||
                    first.y > second.y + second.height ||
                    first.y + first.height < second.y)
        ) {
            return true;
        };
    };

    


}

    render() {
        return (
            <div>
                <canvas ref={this.canvasRef} width={this.state.canvasWidth} height={this.state.canvasHeight} id={"gameboard"}/>
            </div>
        );
    }
}
export default Game2