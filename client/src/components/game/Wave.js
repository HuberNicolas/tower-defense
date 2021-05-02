import React from 'react';
import styled, { css } from "styled-components";
import Minion from "./Minion";

class Wave extends React.Component {

    constructor() {
        super();
        this.state = {
            clicked: false,
            dropped: false,
            background: null,
            color: null,
        };
    }

    spawnWave = (num) => {
      const minionWave = []
      
      for(var i = 1; i < num; i++){
          //var background = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i*10+".png')"
          //var l = 128*i + "px"
          //var t = 128*i + "px"
        minionWave.push(<Minion id={i}></Minion>)
      }
    
      return minionWave
    }

    render() {
        return (
            <div>
                {this.spawnWave(this.props.waveSize)}
            </div>
        )
    }


}
export default Wave