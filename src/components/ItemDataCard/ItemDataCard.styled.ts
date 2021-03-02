import styled from 'styled-components';

interface Props {
  noImage?: boolean;
  highest?: boolean;
  lowest?: boolean;
}

const ItemCardStyled = styled.div<Props>`
  position: relative;
  margin: 0 20px;
  z-index: 2;
  color: #ddd;
  max-height: 90vh;
  disply: flex;
  flex-direction: column;
`;

const ItemCardImageWrapper = styled.div`
  position: relative;
  display: flex;
  box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.1);
  background-color: rgb(25, 44, 52);
  overflow: hidden;
`;

const ItemCardImageContent = styled.div`
  z-index: 1;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 20%, rgba(255, 255, 255, 0) 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  width: 100%;

  h3 {
    color: #fff;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 16px;
  }
`;

const ItemCardImageBlurred = styled.div<Props>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  filter: blur(10px);
  z-index: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 500%;
`;

const ItemCardImageSquare = styled.img<Props>`
  width: 48px;
  height: 48px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  margin-right: 12px;
  background-color: #192c34;
`;

const ItemCardStatWrapper = styled.div`
  position: relative;
  height: 260px;
  padding-bottom: 20px;
  margin-bottom: 10px;
  background-color: #192c34;

  .system-card-graph {
    margin: 20px -20px 20px;
    position: relative;
  }

  small {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 5px;
    font-size: 12px;
    font-style: italic;
  }
`;

const ItemCardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media only screen and (min-width: 767px) {
    flex-direction: row;
    flex: 1;
    min-height: 0px;
  }
`;

const ItemCardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  position: relative;
  box-shadow: 0 4px 12px 2px rgba(0, 0, 0, 0.1);
  background-color: rgb(25, 44, 52);
  min-height: 30vh;

  /* Turn on custom 8px wide scrollbar */
  &:not(.is-mac)::-webkit-scrollbar {
    width: 8px; /* 1px wider than Lion. */
    /* This is more usable for users trying to click it. */
    background-color: rgba(0, 0, 0, 0);
    -webkit-border-radius: 100px;
  }
  /* hover effect for both scrollbar area, and scrollbar 'thumb' */
  &:not(.is-mac)::-webkit-scrollbar:hover {
    background-color: rgba(0, 0, 0, 0.09);
  }

  /* The scrollbar 'thumb' ...that marque oval shape in a scrollbar */
  &:not(.is-mac)::-webkit-scrollbar-thumb:vertical {
    /* This is the EXACT color of Mac OS scrollbars. 
     Yes, I pulled out digital color meter */
    background: rgba(0, 0, 0, 0.5);
    -webkit-border-radius: 100px;
  }
  &:not(.is-mac)::-webkit-scrollbar-thumb:vertical:active {
    background: rgba(0, 0, 0, 0.61); /* Some darker color when you click it */
    -webkit-border-radius: 100px;
  }

  @media only screen and (min-width: 767px) {
    &:first-child {
      margin-right: 5px;
    }

    &:last-child {
      margin-left: 5px;
    }
  }
`;

const ItemCardContentInner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 20px;

  h2 {
    margin: 0;
  }

  table {
    width: calc(100% + 40px);
    margin: 20px -20px;
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

const ItemCardToolTip = styled.div`
  position: fixed;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 10px;
  z-index: 6;
  pointer-events: none;
`;

export {
  ItemCardStyled,
  ItemCardImageWrapper,
  ItemCardImageContent,
  ItemCardImageBlurred,
  ItemCardImageSquare,
  ItemCardStatWrapper,
  ItemCardContentWrapper,
  ItemCardContent,
  ItemCardContentInner,
  ItemCardToolTip,
};
