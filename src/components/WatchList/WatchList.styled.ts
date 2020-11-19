import styled from "styled-components";

interface Props {
  disabled: boolean;
}

const WatchListStyled = styled.div`
  h1 {
    font-size: 24px;
  }

  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    position: relative;
    tr th {
      text-align: left;
      position: sticky;
      top: -1px;
      background-color: rgba(15, 32, 39, 1);
    }
    tr th,
    tr td {
      border: 1px solid #8d8d8d;
      padding: 8px;
    }
    tr td {
      border-top: none;
      border-bottom: none;
    }
    tr th:last-child,
    tr td:last-child {
      border-right: none;
    }

    tr th:first-child,
    tr td:first-child {
      border-left: none;
    }

    tbody tr:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    tr td a {
      color: #fff;
      &:hover {
        color: #f2f2f2;
        text-decoration: underline;
      }
    }
  }
`;

const WatchListHeaderStyled = styled.header`
  padding: 20px 80px 20px 20px;
  background-color: rgba(15, 32, 39, 0.7);
`;

const WatchListReload = styled.a<Props>`
  padding: 0;
  border: none;
  outline: none;
  width: 60px;
  height: 60px;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  font-size: 14px;
  color: #fbb438;
  background-color: transparent;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  .countdown {
    margin-top: -10px;
  }
`;

export { WatchListStyled, WatchListHeaderStyled, WatchListReload };
