import styled from "styled-components";

const MainWrapperStyled = styled.div`
  font-family: "Roboto Condensed", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 0;
  color: #333;
  background: #0f2027;
  background: -webkit-linear-gradient(to right, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);

  * {
    box-sizing: border-box;
  }
`;

export default MainWrapperStyled;
