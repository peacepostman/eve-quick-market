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
    thead tr th:last-child,
    tbody tr td:last-child {
      display: none;
    }
    tr th,
    tr td {
      border: 1px solid #8d8d8d;
      padding: 8px;
    }
    tr td {
      border-top: none;
      border-bottom: none;
      &:first-child {
        position: relative;
        padding-right: 60px;
      }
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
      td .row-actions {
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

    tr td .row-actions {
      opacity: 0;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      margin: 13px 12px 13px 0;
      img {
        vertical-align: middle;
      }
    }
  }
`;

const WatchListLoaderStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  top: 12px;
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

export {
  WatchListStyled,
  WatchListLoaderStyled,
  WatchListHeaderStyled,
  WatchListReload,
};
