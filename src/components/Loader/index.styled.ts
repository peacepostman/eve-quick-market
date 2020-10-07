import styled, { keyframes } from "styled-components";

interface LoaderProps {
  readonly size: string;
  readonly color: string;
}

const rotateLoading = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoaderStyled = styled.div<LoaderProps>`
  display: flex;
  &:after {
    content: "";
    border: 2px solid ${(props) => props.color};
    border-radius: 50%;
    border-right-color: transparent;
    border-top-color: transparent;
    height: ${(props) => props.size};
    width: ${(props) => props.size};
    position: absolute;
    display: block;
    position: relative;
    margin: 0 auto;
    animation: ${rotateLoading} 0.4s infinite linear;
  }
`;

export default LoaderStyled;
