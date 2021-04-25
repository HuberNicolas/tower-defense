import React from 'react';
import Minion from './Minion';


function spawnWave (numberOfMinions) {
    const minionArray = []
    var i;

    for (var i = 0; i < numberOfMinions; i++) {
        console.log("added a minion")
        minionArray.push(<Minion></Minion>)
    }
    //console.log(minionArray)
    return (
        <div>
            {minionArray}
        </div>
    )
}

const Wave = ({numberOfMinions}) => (
    <div> 
        {spawnWave(numberOfMinions)} 
    </div>

) 
export default Wave;