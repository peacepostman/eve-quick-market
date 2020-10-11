import styled from "styled-components";

const SystemCardWrapperStyled = styled.div`
  width: 100vw;
  display: flex;
  align-items: 
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  padding-bottom: 60px;
  margin-bottom: 80px;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default SystemCardWrapperStyled;
