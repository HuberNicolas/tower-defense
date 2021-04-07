import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Player from '../../views/Player';
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import Tile from "./Tile";
import Board from "./Board";
import Statusbar from "./Statusbar";
import Shop from "./Shop";




/*class Game extends React.Component {
    board = {
        tiles : [
            {
                id: 1,
                empty: true
            },
            {
                id: 2,
                empty: true
            }
        ]
    }

    render() {
        console.log(this.board.tiles)
        const elements = [1,2,3,4];
        const items = [];

        for (const [index, value] of elements.entries()) {
            items.push(<li key={index}>{value}</li>)
        }




        return(
            <div>
                <Tile />
                <Board />
                <Tile tiles={this.board.tiles}/>
                <Tile tiles={this.board.tiles}/>
                {items}


            </div>
        );
    }
}*/



export default class Game extends React.Component {
    createTable = () => {
        let table = []

        // Outer loop to create parent
        for (let i = 0; i < 10; i++) {
            let children = []
            //Inner loop to create children
            for (let j = 0; j < 10; j++) {
                children.push(<Tile/>)
            }
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }
        return table
    }
    render() {
        return(

            <div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        float: "center"
                    }}
                > <Statusbar/> </div>
                <div
                    style={{
                        display: "flex",
                        //justifyContent: "center",
                        //alignItems: "center",
                        float: "left"
                    }}
                > <table> {this.createTable()}</table> </div>

                <div
                    style={{
                        display: "flex",
                        //justifyContent: "center",
                        //alignItems: "center",
                        float: "right"
                    }}
                > <table> <Shop /></table> </div>





                {/* <Tile />  */}

            </div>
            );
    }
}