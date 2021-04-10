import { useState, useEffect } from "react";
import { createBoard } from "../gameHelpers";

export const useBoard = (wave, resetWave) => {
  const [board, setBoard] = useState(createBoard());


  useEffect(() => {


    const updateBoard = (prevBoard) => {
        console.log("update board")
      // first flush the stage from prev. render

      const newBoard = prevBoard.map((row) =>
        // omptimise with for loops
        row.map((tile) => (tile[1] === "clear" ? [0, "clear"] : tile))
      );
      // then draw minion (draw new stage) : loop through new minion
      wave.minion.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            // rows | col
            newBoard[y + wave.pos.y][x + wave.pos.x] = [
              value,
              `${wave.collided ? "merged" : "clear"}`, // if collided set to merged
            ];
          }
        });
      });

      // collision detection

      if(wave.collided) {
          resetWave();
      }


      return newBoard;
    };

    setBoard((prev) => updateBoard(prev));
  }, [wave, resetWave]);

  return [board, setBoard];
};
