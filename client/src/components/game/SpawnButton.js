import React from 'react';
import { StyledSpawnButton } from './styles/StyledSpawnButton';


const SpawnButton = ({ callback }) => (
    <StyledSpawnButton onClick={callback}>Spawn Minions</StyledSpawnButton>
    //<div> Spawn Minion Wave </div>
) 
export default SpawnButton;