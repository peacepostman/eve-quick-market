import styled from "styled-components";

interface Props {
  disabled: boolean;
}

const WatchListStyled = styled.div`
  h1 {
    font-size: 24px;
  }
  .arrow-wrapper {
    margin-left: 5px;
    display: inline-block;
  }

  .arrow:after {
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: transparent;
    border-bottom-color: rgba(221, 221, 221, 0.4);
    border-width: 6px;
  }

  .arrow {
    position: relative;
    display: block;
    width: 12px;
    height: 10px;
    &.is-active:after {
      border-bottom-color: #ddd;
    }
    &.is-down:after {
      margin-top: 5px;
      border-bottom-color: transparent;
      border-top-color: rgba(221, 221, 221, 0.4);
    }
    &.is-active.is-down:after {
      border-top-color: #ddd;
    }
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
      a {
        color: #ddd;
        text-decoration: none;
      }
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
      td .copy {
        opacity: 1;
      }
    }

    tr td a {
      color: #fff;
      &:hover {
        color: #f2f2f2;
        text-decoration: underline;
      }
    }

    tr td .copy {
      opacity: 0;
      cursor: pointer;
      margin-left: 10px;
      float: right;
      img {
        vertical-align: middle;
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
