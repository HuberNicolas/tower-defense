import React from 'react';
import Square from './Square';
import "./StyledField.css"


function double(i) {
    return i*2;
  }


// default jsx export 
const Field = ({i}) => (
    <div>
        <Square value={double(i)}></Square>
    </div>
)

export default Field;


// function that renders the field depending on size
export const renderField = (size) => {
    var board = new Array(size);

    // create board
    for (var i = 0; i < board.length; i++) {
        board[i] = new Array(size);
    }
    //console.log(board);

    // fill board
    var counter = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            // add properties here
            board[i][j] = [i,j,'free',100];       
        }
        
            
    }
    console.log(board);
    /*
    return(
        <div>
            {board.map((items, index) => {
                return (
                <ol>
                    {board.map((subItems) => {
                    return <li> {subItems} </li>;
                    })}
                </ol>
                );
            })}
        </div>
    )
    */
    return(
        <div>
            {board.map((items, index) => {
                return (
                <ol>
                    {
                        board.map((subItems,index2) => {
                            return <li> {index} - {index2} </li>;
                        })
                    }
                </ol>
                );
            })}
        </div>
    )
}
