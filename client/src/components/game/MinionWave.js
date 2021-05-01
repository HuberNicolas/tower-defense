import React from 'react';
import styled, { css } from "styled-components";
import Crawler from "./Crawler";


const spawnWave = (num) => {
  const minionWave = []
  

  for(var i = 1; i <= num; i++){
      //var background = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i*10+".png')"
      //var l = 128*i + "px"
      //var t = 128*i + "px"

    minionWave.push(<Crawler id={i}></Crawler>)
  }

  return minionWave
}


const MinionWave = (prop) => {
	return (
		<div>
      {spawnWave(prop.numberOfMinions)}
    </div>
	)
}

export default MinionWave