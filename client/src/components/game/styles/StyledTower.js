import React from "react"
import styled from "styled-components";
import Tower from "./Tower";

export const styledTower = styled(Tower)`
    background-color: ${props => props.color};
`