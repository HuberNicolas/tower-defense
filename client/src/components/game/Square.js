import React from "react"
import styled from "styled-components";
import Tower from "./Tower";

const Button = styled.button`
    background-color: ${props => props.color};
`;

const ToggleButton = styled.button`
	/* if true, button will be visible */
	visibility: ${props => (props.visible ? "visible" : "hidden")};
`

const YellowButton = styled.button`
    background-color: ${'yellow'};
    position: ${'relative'};
	right: ${'float'};
    top: ${'6px'};
`
const ColorTower = styled(Tower)`
    backgroundcolor: ${props => props.color};
	border: ${'1px solid'}
    right: ${'600px'};
`

const Square = () => {
	return (
		<React.Fragment>
			<Button color="green">This is a green button</Button>
			<Button color="blue">This is a blue button</Button>

			<ToggleButton visible>This button is visible</ToggleButton>
			<ToggleButton>This button is not visible</ToggleButton>
			{/* different syntax */}
			<ToggleButton visible={false}>This button is visible</ToggleButton>
			<ToggleButton visible={false}>This button is not visible</ToggleButton>
            <YellowButton color="green">Hi</YellowButton>
            <ColorTower color="blue"></ColorTower>
			<YellowButton color="green">Hi</YellowButton>
			<ColorTower></ColorTower>
		</React.Fragment>
	)
}

export default Square