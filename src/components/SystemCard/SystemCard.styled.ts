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
  box-shadow: ${(props) =>
    props.lowest
      ? "0 4px 12px 2px rgba(0, 0, 0, 0.1), inset 0 0 0 1px #47c347"
      : props.highest
      ? "0 4px 12px 2px rgba(0, 0, 0, 0.1), inset 0 0 0 1px #e03333"
      : "0 4px 12px 2px rgba(0, 0, 0, 0.1)"};
  transition: box-shadow 0.2s ease-in;
  z-index: 2;

  background-color: rgb(25, 44, 52);
  color: #ddd;

  h3 {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 16px;
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
    props.lowest || props.highest ? "calc(100% - 2px)" : "100%"};
  margin: ${(props) => (props.lowest || props.highest ? "1px" : null)};
`;

const SystemCardContent = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;

  .system-card-graph {
    margin: 20px -20px 20px;
    position: relative;
  }

  table {
    margin: auto -20px -20px;
    border-spacing: 0;
    border-collapse: collapse;
    tr th {
      text-align: left;
    }
    tr th,
    tr td {
      border: 1px solid rgba(204, 204, 204, 0.2);
      padding: 8px;
    }
    tr td {
      border-top: none;
      border-bottom: none;
    }
    tr:last-child td {
      border-bottom: 1px solid rgba(204, 204, 204, 0.2);
    }
  }
`;

const SystemCardDelete = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  margin: 4px;
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

const SystemToolTip = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
  z-index: 6;
  pointer-events: none;
`;

export {
  SystemCardStyled,
  SystemCardImg,
  SystemCardContent,
  SystemCardDelete,
  SystemToolTip,
};
