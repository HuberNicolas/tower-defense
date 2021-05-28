import styled, { keyframes } from "styled-components";

export const Button3 = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  font-family: 'Press Start 2P';
  position: relative;
  top: ${props => props.top};
  left: ${props => props.left};
  z-index: 2;
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 26px;
  text-align: center;
  color: rgba(16, 89, 0, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: none;
  border-radius: 35px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(0, 0, 0);
  transition: all 0.1s ease;
  animation-name: ${changeColor};
`;

// does not work yet
const changeColor = keyframes `
    from {
        background: rgb(0, 0, 0);;
    }
    to {
        background: rgb(120, 0, 0);;
    }
`