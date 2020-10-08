import styled from "styled-components";

const CalculatorStyled = styled.div`
  display: flex;
  position: fixed;
  align-items: center;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: rgba(15, 32, 39, 0.7);
  padding: 20px;
  z-index: 3;
  box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  color: #fff;
`;

const CalculatorInput = styled.input`
  align-items: center;
  background-color: #0a1b22;
  border-radius: 4px;
  border: none;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  cursor: default;
  display: flex;
  min-height: 38px;
  outline: 0 !important;
  position: relative;
  transition: all 100ms;
  box-sizing: border-box;
  padding: 2px 8px;
  width: 110px;

  &:hover {
    box-shadow: 0 0 0 2px #122b36;
  }

  &:focus,
  &:active {
    box-shadow: 0 0 0 2px #1e3742;
  }
`;

const CalculatorTotal = styled.div`
  margin-left: auto;
  display: flex;
  font-weight: bold;
  font-size: 24px;
  color: #44af44;
`;

export { CalculatorStyled, CalculatorInput, CalculatorTotal };
