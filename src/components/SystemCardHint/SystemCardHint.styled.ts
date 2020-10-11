import styled from "styled-components";

interface Props {
  direction: "left" | "right";
}

const SystemCardHintStyled = styled.div<Props>`
  transition: all 0.2s ease-in;
  position: absolute;
  bottom: 40px;
  z-index: 1;
  height: 30px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-top: none;

  &:before {
    content: "";
    border: solid rgba(255, 255, 255, 0.6);
    border-width: 0 1px 1px 0;
    display: inline-block;
    padding: 5px;
    position: absolute;
    bottom: -6px;
    left: 50%;
    margin-left: -9px;
    transition: transform 0.15s ease-in;
    transform: ${(props) =>
      props.direction === "left" ? "rotate(-45deg)" : "rotate(135deg)"};
  }

  .infos {
    position: absolute;
    left: 50%;
    bottom: -30px;
    transform: translateX(-50%);
    color: #fff;
    font-weight: bold;

    .percent {
      color: #44af44;
      margin-right: 20px;
    }
  }
`;

export default SystemCardHintStyled;
