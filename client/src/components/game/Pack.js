import React from 'react';
import styled, { css } from "styled-components";
import Crawler from "./Crawler";

class Pack extends React.Component {

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
    
        minionWave.push(<Crawler id={i}></Crawler>)
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
export default Pack