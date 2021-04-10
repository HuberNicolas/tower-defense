export const BOARD_WITDH = 10;
export const BOARD_HEIGHT = 10;

export const createBoard = () =>
    Array.from(Array(BOARD_HEIGHT), () => 
        new Array(BOARD_WITDH).fill([0, 'clear']) 
    
    )


export const checkCollision = (wave, board, {x: moveX, y: moveY}) => {
    for(let y = 0; y < wave.minion.length; y += 1) {
        for (let x = 0; x < wave.minion[y].length; x+= 1) {
            
            // 1. Check that we're on an actual Minion Tile
            if(wave.minion[y][x] !== 0) {
                if (
                // 2. Check that our move is inside the game areas height (y)
                // We shouldn't go through the bottom of the play area
                    !board[y + wave.pos.y + moveY] || // look in the future

                // 3. Check that our move is iside the game areas width (x)
                    !board[y + wave.pos.y + moveY][x + wave.pos.x + moveX] ||

                // 4. Check that the Tile we're moving isn't set to clear
                board[y + wave.pos.y + moveY][x + wave.pos.x + moveX][1] !== 'clear'
                ) {
                    return true;
                }
            }



        }
    }
}
