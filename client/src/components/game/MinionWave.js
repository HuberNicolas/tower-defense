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

function animation () {
    const elements = ['one', 'two', 'three'];

  const items = []
  var i;

  /*
  for (const [index, value] of elements.entries()) {
    items.push(<li key={index}>{value}</li>)
  }
  */
  
  for (var i = 0; i<3; i++) {
      items.push(<div class="animatedWave"></div>)
      items.push(<div> </div>)
      //setTimeout(10);
  }

  return (
    <div>
      {items}
    </div>
  )
}


//<div>{for loop  -> div}<\div></div>

const MinionWave = () => (
    //<div class="animatedWave"></div>
    //<div > {printMultipleTimes()} </div> works
    <div > {animation()} </div>
    //<div> Spawn Minion Wave </div>

) 
export default MinionWave;