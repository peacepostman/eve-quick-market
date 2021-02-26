import styled from 'styled-components';

const TabsStyled = styled.nav`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

interface Props {
  readonly isActive: boolean;
}

const TabItemStyled = styled.button<Props>`
  display: flex;
  padding: 8px;
  background-color: ${(props) => (props.isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent')};
  opacity: ${(props) => (props.isActive ? 1 : 0.6)};
  box-shadow: ${(props) => (props.isActive ? 'inset 3px 2px 2px rgba(0,0,0, .2)' : null)};
  color: #333;
  border: none;
  height: 50px;
  position: relative;
  cursor: pointer;

  img {
    width: 100%;
    height: auto;
    position: absolute;
    width: calc(100% - 16px);
    height: calc(100% - 16px);
    object-fit: cover;
    transition: all 0.15s ease-in;
  }

  img.main {
    z-index: 2;
  }
  img.main:hover ~ img.glow {
    opacity: 1;
  }
  img.glow {
    z-index: 1;
    transform: scale(1.01);
    filter: brightness(1) contrast(200%) blur(3px);
    opacity: 0;
  }

  &:hover,
  &:focus {
    outline: none;
  }
`;

const TabPanelsStyled = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  width: 100%;
  background-color: #171f23;
`;

const TabPanelStyled = styled.div<Props>`
  display: ${(props) => (props.isActive ? 'flex' : 'none')};
  min-height: 100vh;
  width: 100%;
`;

export { TabsStyled, TabItemStyled, TabPanelsStyled, TabPanelStyled };
