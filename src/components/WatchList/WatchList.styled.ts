import styled from "styled-components";

const WatchListStyled = styled.div`
  table {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
    tr th {
      text-align: left;
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
  }
`;

export { WatchListStyled };
