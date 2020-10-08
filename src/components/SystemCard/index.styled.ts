import styled from "styled-components";

interface Props {
  noImage?: boolean;
  highest?: boolean;
  lowest?: boolean;
}

const SystemCardStyled = styled.div<Props>`
  display: flex;
  position: relative;
  margin: 0 20px;
  min-width: 350px;
  flex: 350px 0 0;
  flex-direction: column;
  background: #fff;
  box-shadow: ${(props) =>
    props.lowest
      ? "0 4px 12px 2px rgba(0, 0, 0, 0.1), inset 0 0 0 4px #47c347"
      : props.highest
      ? "0 4px 12px 2px rgba(0, 0, 0, 0.1), inset 0 0 0 4px #e03333"
      : "0 4px 12px 2px rgba(0, 0, 0, 0.1)"};
  border-radius: ${(props) => (props.noImage ? "5px" : "0 0 5px 5px")};
  transition: box-shadow 0.2s ease-in;
  z-index: 2;

  h3 {
    margin-top: 0;
  }

  &:last-child:after {
    content: "";
    display: block;
    position: absolute;
    right: -20px;
    width: 20px;
    height: 1px;
  }
`;

const SystemCardImg = styled.img<Props>`
  width: ${(props) =>
    props.lowest || props.highest ? "calc(100% - 6px)" : "100%"};
  margin: ${(props) => (props.lowest || props.highest ? "3px" : null)};
`;

const SystemCardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SystemCardDelete = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  margin: 4px;
  cursor: pointer;

  img {
    width: 24px;
    height: 24px;
  }
`;

export { SystemCardStyled, SystemCardImg, SystemCardContent, SystemCardDelete };
