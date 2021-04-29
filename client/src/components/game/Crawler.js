import React, {Component} from "react"
import styled from "styled-components";
import Tile from "./Tile";



const StyledCrawler = styled.canvas`
    width: ${props => props.width};
    height: ${props => props.height};
    background: ${props => props.background};
    background-position: center center;
    background-color: ${props => props.color};
    position: absolute;
    left: ${props => props.left};
    top: ${props => props.top};
    z-index: 3;
    onClick: ${console.log("h")};
`

class Crawler extends React.Component {


    constructor() {
        super();
        this.state = {
            background: "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png')",
            color: "green",
            width: "64px",
            height: "64px",
            layer: "",
        };
    }


    createCrawler = (id) => {
        return <StyledCrawler
            background={this.state.background} 
            color={this.state.color} 
            width={this.state.width} 
            height={this.state.height} 
            left={"180px"} 
            top={"0px"}
            id={"m"+this.props.id}
            onClick={()=> {
                console.log(id)
                this.change(id)}
            }> 
        
        </StyledCrawler>
    }



    spawnCrawlers = (num) => {
        const crawlers = []
        var background = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png')"
    
        for(var i = 9; i < num; i++){
            var background = "url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+i*10+".png')"
            //var l = 128*i + "px"
            //var t = 128*i + "px"
            var layer = "m"+(i)
            //console.log(layer)
            crawlers.push(
                <StyledCrawler 
                    background={this.state.background} 
                    color={this.state.color} 
                    width={"32px"} 
                    height={"32px"} 
                    left={"80px"} 
                    top={"0px"} 
                    id={layer} 
                    onClick={()=> {
                        this.change(this.id)}
                    }>

                </StyledCrawler>
            )
        }
    
        return crawlers
    }

    change = (e) => {
        console.log(e)
        //if(this.state.layer == "die") {
            /*
        if(e == 9) {
            console.log("hi")
            this.setState({
                layer: "die",
                height: "0px",
                width: "0px",
                color: "red"
            })
        }
        */

        this.setState({
            layer: "die",
            height: "0px",
            width: "0px",
            color: "blue"
        })



        //console.log("After change " + this.state.layer)

    }
    render() {
        return (<div>
                
                {/*<div> {this.spawnCrawlers(12)}</div> */}
                {/* <StyledCrawler color={this.state.color} width={this.state.width}height={this.state.height} left={this.props.left} top={this.props.top} id={"m9"}
                onClick={() => {this.change()}}>
                </StyledCrawler> */}
                <div>{this.createCrawler(this.state.id)}</div>
            </div>
        )
    }


}
export default Crawler