import styled from "styled-components";

const ItemSearchStyled = styled.div`
  width: 30%;
  margin-left: 50%;
  margin-bottom: 60px;
  transform: translateX(-50%);

  @media only screen and (max-width: 480px) {
    width: 60%;
  }
`;

export default ItemSearchStyled;
