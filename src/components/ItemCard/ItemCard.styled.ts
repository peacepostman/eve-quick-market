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
  opacity: 0.7;
  transition: opacity 0.15s ease-in;

  &:hover {
    opacity: 1;
  }

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
  color: #ddd;
  font-weight: bold;
  font-size: 14px;
`;

const ItemCardStyled = styled.div<Props>`
  display: flex;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  margin: 0 20px;
  min-width: 80px;
  height: 80px;
  flex: 80px 0 0;
  box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.1);
  transition: opacity 0.2s ease-in;
  background-color: rgba(15, 32, 39, 1);
  border: 1px solid
    ${(props) =>
      props.selected ? "rgba(255, 255, 255, 0.65)" : "rgba(13, 28, 34, 1)"};

  &:hover {
    ${ItemName} {
      transform: translateY(0);
    }
  }

  &:last-child:after {
    content: "";
    display: block;
    position: absolute;
    right: -20px;
    width: 20px;
    height: 1px;
  }

  ${ItemName} {
    transform: ${(props) => (props.selected ? "translateY(0)" : null)};
  }

  img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }

  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    min-width: 120px;
    height: 120px;
    flex: 120px 0 0;
  }
`;

export { ItemCardStyled, ItemCardDelete, ItemName };
