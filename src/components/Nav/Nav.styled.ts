import styled from 'styled-components';

const NavStyled = styled.nav`
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 3;
  flex-direction: column;
  width: 50px;
  height: 100vh;
  background-color: rgba(30, 29, 29, 0.5);
  border-right: 1px solid #454c4f;
`;

export { NavStyled };
