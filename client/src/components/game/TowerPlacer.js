import React, {Component} from "react";
import Tower from "./Tower";
import styled from "styled-components";


export const TowerPlacer = (text) => {
    return ( 
            <div style={{backgroundColor: 'blue'}}> 
                {text.text}
            </div>
         );  
  }

  export default TowerPlacer;
