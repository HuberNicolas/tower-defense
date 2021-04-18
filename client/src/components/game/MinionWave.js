import React from 'react';
import "./StyledMinionWave.css"


function printMultipleTimes () {
    for (var i = 1; i <= 10; i++) {
        console.log(i);
        
    }
    return (
        <div class="animatedWave"></div>
    )

}

//<div>{for loop  -> div}<\div></div>

const MinionWave = () => (
    //<div class="animatedWave"></div>
    <div > {printMultipleTimes()} </div>
    //<div> Spawn Minion Wave </div>

) 
export default MinionWave;