import styled from "styled-components";

interface Props {
  selected: boolean;
}

const ItemCardDelete = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  margin: 10px;
  z-index: 2;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

const ItemName = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  transition: transform 0.2s ease-in;
  transform: translateY(100%);
  backdrop-filter: blur(6px);
  color: #fff;
  font-weight: bold;
`;

const ItemCardStyled = styled.div<Props>`
  display: flex;
  overflow: hidden;
  position: relative;
  margin: 0 20px;
  min-width: 120px;
  height: 120px;
  flex: 120px 0 0;
  box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  transition: opacity 0.2s ease-in;
  background-color: rgba(15, 32, 39, 1);
  border: 3px solid
    ${(props) =>
      props.selected ? "rgba(255, 255, 255, 0.65)" : "rgba(13, 28, 34, 1)"};

  &:hover {
    ${ItemName} {
      transform: translateY(0);
    }
  }

  ${ItemName} {
    transform: ${(props) => (props.selected ? "translateY(0)" : null)};
  }

  img {
    border-radius: 5px;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
`;

export { ItemCardStyled, ItemCardDelete, ItemName };
