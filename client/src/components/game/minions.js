export const MINIONS = {
    0: { shape: [[0]], color: '0, 0, 0'},
    A: {
        shape: [
                ['A']
               ],
        color: '80, 227, 230',       
    },
    B: {
        shape: [
                ['B'],
                ['B']
               ],
        color: '36, 95, 223',       
    },
   
}

export const randomMinion = () => {
    const minions = 'AB';
    const randMinion = 
        minions[Math.floor(Math.random() * minions.length)];
    return MINIONS[randMinion];
}