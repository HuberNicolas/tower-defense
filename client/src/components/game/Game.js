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


export default class Game extends React.Component {

    printHello = () => {
        return <h1> Hello </h1>
    }


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
                        float: "center",
                        backgroundColor: "red"
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
                        float: "right",
                        backgroundColor: "red"
                    }}
                > <table> <Shop /></table> </div>
                <div> {this.printHello()}</div>

                {/* <Tile />  */}
            </div>
        );
    }
}