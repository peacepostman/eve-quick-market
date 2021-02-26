import styled from 'styled-components';

interface Props {
  disabled: boolean;
}

const WatchListStyled = styled.div`
  width: 100%;
  h1 {
    font-size: 24px;
  }
  .arrow-wrapper {
    position: absolute;
    right: 3px;
    bottom: 7px;
  }

  .arrow:after {
    border: solid transparent;
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-color: transparent;
    border-bottom-color: rgba(221, 221, 221, 0.3);
    border-width: 4px;
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
      margin-top: 2px;
      border-bottom-color: transparent;
      border-top-color: rgba(221, 221, 221, 0.3);
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
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    background-color: #171f23;
    tr th {
      text-align: left;
      position: sticky;
      background-color: #171f23;
      z-index: 1;
      top: 86px;
      a {
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
      }
    }
    thead tr th:last-child,
    tbody tr td:last-child {
      display: none;
    }
    tr th,
    tr td {
      border: 1px solid #454c4f;
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
    tr td:last-child,
    tr th:nth-last-child(2),
    tr td:nth-last-child(2) {
      border-right: none;
    }

    tr th:first-child,
    tr td:first-child {
      border-left: none;
    }

    tbody tr:hover {
      background-color: rgba(255, 255, 255, 0.15);
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
  padding: 10px 80px 10px 10px;
  background-color: #171f23;
  position: sticky;
  top: 0;
  z-index: 2;
  h1 {
    color: rgba(255, 255, 255, 0.8);
    font-size: 20px;
    font-weight: normal;
    margin: 0 0 10px;
  }
`;

const WatchListReload = styled.a<Props>`
  padding: 0;
  border: none;
  outline: none;
  width: 36px;
  height: 36px;
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  font-size: 10px;
  color: #b3bbc0;
  background-color: transparent;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};

  .countdown {
    margin-top: -6px;
  }
`;

export { WatchListStyled, WatchListLoaderStyled, WatchListHeaderStyled, WatchListReload };
