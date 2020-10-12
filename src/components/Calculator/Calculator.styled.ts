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
  padding: 10px 20px;
  z-index: 3;
  box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  color: #fff;
`;

const CalculatorLabel = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.6);
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

const CalculatorVolume = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 5px;
`;

const CalculatorTotal = styled.div`
  margin-left: auto;
  display: flex;
  font-weight: bold;
  font-size: 16px;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    li span {
      font-weight: normal;
      color: rgba(255, 255, 255, 0.6) !important;
    }
    li:nth-child(1) {
      color: #fff;
    }
    li:nth-child(2) {
      color: #e03333;
    }
    li:nth-child(3) {
      color: #44af44;
    }
  }
`;

export {
  CalculatorStyled,
  CalculatorLabel,
  CalculatorInput,
  CalculatorVolume,
  CalculatorTotal,
};
