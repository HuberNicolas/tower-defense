import { useCallback, useState } from 'react';
import Board from '../Board';
import { BOARD_WITDH, } from '../gameHelpers';

import { MINIONS, randomMinion} from '../minions';

export const useWave = () => {
    const [wave, setWave] = useState({
        pos : {x: 0, y: 0},
        minion: MINIONS[0].shape, // initially, no minion will spawn
        collided: false,
    });

    const updateWavePos = ({ x, y, collided }) => {
        setWave(prev => ( {
            ...prev,
            pos: {x: (prev.pos.x += x), y: (prev.pos.y += y)},
            collided,
        }))
    }

    const resetWave = useCallback(() => {
        setWave({
            pos: {x: BOARD_WITDH / 2 - 2, y: 0}, // middle of the top
            minion: randomMinion().shape,
            collided : false,
        })
    }, [])

    return [wave, updateWavePos, resetWave];
}