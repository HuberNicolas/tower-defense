import React from 'react';
import styled, { css } from "styled-components";


/* Developing only 
function createCSS() {
    let styles = '';
  
    for (let i = 11; i < 15; i += 1) {
       styles += `
         #layer${i} {
           animation-delay: ${i - 1.5}s;
           fill: white;
           opacity: 0;
         }
       `
    }
  
    return css`${styles}`;
  }


  const StyledWave = styled.canvas`
  ${createCSS()};
`
  */

const StyledWave = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height}; 
    background: ${props => props.background};
    background-position: center center;
    background-color: ${props => props.color}; 
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
    id: ${props => props.layer};
`;

const spawnWave = (num) => {
    const minionWave = []
    var background = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png')"

    for(var i = 1; i <= num; i++){
        //var background = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i*10+".png')"
        //var l = 128*i + "px"
        //var t = 128*i + "px"
        var layer = "m" + (i)
      minionWave.push(<StyledWave background={background} color={"pink"} width={"32px"} height={"32px"} left={"80px"} top={"0px"} id={layer} ></StyledWave>)
    }

    return minionWave
}

const Wave = () => {
	return (
		<div>

            {spawnWave(8)}
            {/* Experimental */}
            { /*<StyledWave background={"url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png')"} color={"pink"} width={"32px"} height={"32px"} left={"390px"} top={"650px"} id={"layer4"}></StyledWave> */}
            </div>
	)
}

export default Wave