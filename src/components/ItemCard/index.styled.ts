import styled from "styled-components";

interface Props {
  selected: boolean;
}

const ItemCardStyled = styled.div<Props>`
  display: flex;
  position: relative;
  margin: 0 20px;
  min-width: 180px;
  height: 180px;
  flex: 180px 0 0;
  box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  transition: opacity 0.2s ease-in;
  opacity: ${(props) => (props.selected ? 1 : 0.75)};
  background-color: rgba(15, 32, 39, 1);
  border: 6px solid
    ${(props) =>
      props.selected ? "rgba(255, 255, 255, 0.65)" : "rgba(13, 28, 34, 1)"};

  &:hover {
    opacity: ${(props) => (props.selected ? 1 : 0.85)};
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

export { ItemCardStyled, ItemCardDelete };
