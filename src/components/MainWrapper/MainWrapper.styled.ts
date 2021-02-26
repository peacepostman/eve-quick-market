import styled from 'styled-components';

const MainWrapperStyled = styled.div`
  font-family: 'Roboto Condensed', sans-serif;
  display: flex;
  min-height: 100vh;
  padding: 0 0 0 50px;
  color: #333;
  background: #0f2027;
  background: -webkit-linear-gradient(to right, #0f2027, #203a43, #2c5364);
  background: linear-gradient(to right, #0f2027, #203a43, #2c5364);

  * {
    box-sizing: border-box;
  }

  .Toastify__toast-container {
    z-index: 9999;
    -webkit-transform: translate3d(0, 0, 9999px);
    position: fixed;
    padding: 4px;
    width: 320px;
    box-sizing: border-box;
    color: #fff;
  }

  .Toastify__toast-container--top-right {
    top: 1em;
    right: 1em;
  }

  .Toastify__toast-container--bottom-right {
    bottom: 1em;
    right: 1em;
  }

  @media only screen and (max-width: 480px) {
    .Toastify__toast-container {
      width: 100vw;
      padding: 0;
      left: 0;
      margin: 0;
    }
    .Toastify__toast-container--top-right {
      top: 0;
      transform: translateX(0);
    }

    .Toastify__toast-container--rtl {
      right: 0;
      left: initial;
    }
  }
  .Toastify__toast {
    position: relative;
    min-height: 64px;
    box-sizing: border-box;
    margin-bottom: 1rem;
    padding: 8px;
    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.1), 0 2px 15px 0 rgba(0, 0, 0, 0.05);
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    max-height: 800px;
    overflow: hidden;
    font-family: sans-serif;
    cursor: pointer;
    direction: ltr;
    backdrop-filter: blur(6px);
  }
  .Toastify__toast--rtl {
    direction: rtl;
  }
  .Toastify__toast--dark {
    background: rgb(25, 44, 52);
    color: rgba(255, 255, 255, 0.8);
  }
  .Toastify__toast--default {
    background: #fff;
    color: #aaa;
  }
  .Toastify__toast--info {
    background: #3498db;
  }
  .Toastify__toast--success {
    background: #07bc0c;
  }
  .Toastify__toast--warning {
    background: #f1c40f;
  }
  .Toastify__toast--error {
    background: rgba(231, 76, 60, 0.6);
  }
  .Toastify__toast-body {
    margin: auto 0;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
  }

  @media only screen and (max-width: 480px) {
    .Toastify__toast {
      margin-bottom: 0;
    }
  }
  .Toastify__close-button {
    color: #fff;
    background: transparent;
    outline: none;
    border: none;
    padding: 0;
    cursor: pointer;
    opacity: 0.7;
    transition: 0.3s ease;
    -ms-flex-item-align: start;
    align-self: flex-start;
  }
  .Toastify__close-button--default {
    color: #000;
    opacity: 0.3;
  }
  .Toastify__close-button > svg {
    fill: currentColor;
    height: 16px;
    width: 14px;
  }
  .Toastify__close-button:hover,
  .Toastify__close-button:focus {
    opacity: 1;
  }

  @keyframes Toastify__trackProgress {
    0% {
      transform: scaleX(1);
    }
    100% {
      transform: scaleX(0);
    }
  }
  .Toastify__progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    z-index: 9999;
    opacity: 0.7;
    background-color: rgba(255, 255, 255, 0.7);
    transform-origin: left;
  }
  .Toastify__progress-bar--animated {
    animation: Toastify__trackProgress linear 1 forwards;
  }
  .Toastify__progress-bar--controlled {
    transition: transform 0.2s;
  }
  .Toastify__progress-bar--rtl {
    right: 0;
    left: initial;
    transform-origin: right;
  }
  .Toastify__progress-bar--default {
    background: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  }
  .Toastify__progress-bar--dark {
    background: rgba(255, 255, 255, 0.6);
  }

  @keyframes Toastify__slideInRight {
    from {
      transform: translate3d(110%, 0, 0);
      visibility: visible;
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes Toastify__slideInLeft {
    from {
      transform: translate3d(-110%, 0, 0);
      visibility: visible;
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  @keyframes Toastify__slideOutRight {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      visibility: hidden;
      transform: translate3d(110%, 0, 0);
    }
  }
  @keyframes Toastify__slideOutLeft {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      visibility: hidden;
      transform: translate3d(-110%, 0, 0);
    }
  }
  .Toastify__slide-enter--top-right,
  .Toastify__slide-enter--bottom-right {
    animation-name: Toastify__slideInRight;
  }

  .Toastify__slide-exit--top-right,
  .Toastify__slide-exit--bottom-right {
    animation-name: Toastify__slideOutRight;
  }
`;

export default MainWrapperStyled;
