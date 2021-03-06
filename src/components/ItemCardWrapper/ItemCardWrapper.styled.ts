import styled from "styled-components";

const ItemCardWrapperStyled = styled.div`
  width: 100vw;
  display: flex;
  align-items: 
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-y: hidden;
  overflow-x: scroll;
  padding-bottom: 40px;
  padding-top: 40px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default ItemCardWrapperStyled;
