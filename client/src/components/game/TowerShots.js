import React from 'react';
import "./StyledTowerShot.css"


function printMultipleTimes () {
    for (var i = 1; i <= 10; i++) {
        console.log(i);
        
    }
    return (
        <div class="animatedShot"></div>
    )

}




//<div>{for loop  -> div}<\div></div>

const TowerShot = () => (
    //<div class="animatedWave"></div>
    <div > {printMultipleTimes()} </div>
    //<div> Spawn Minion Wave </div>

) 
export default TowerShot;