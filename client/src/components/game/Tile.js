import React, {Component} from 'react';


export default function Tile() {
    return (
        <div
            style={{
                display: "table-cell",
                height: "50px",
                width: "50px",
                backgroundColor: "blue",
                border: "5px solid transparent",
                borderCollapse: "separate",
                backgroundImage: "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/7.png')",
                //backgroundImage: "url('https://www.transparentpng.com/thumb/winnie-the-pooh/images-about-winnie-the-pooh-pictures-32.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        />
    );
}