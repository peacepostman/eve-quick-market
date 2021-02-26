import styled from 'styled-components';

const PlayerSkillSidebar = styled.div<{
  isOpen: boolean;
}>`
  position: fixed;
  width: 420px;
  max-width: 100%;
  background-color: rgba(22,30,34,0.9);
  border-left: 1px solid #454c4f;
  backdrop-filter: blur(3px);
  top 0;
  right: 0;
  bottom: 0;
  z-index: 8;
  padding: 80px 20px 20px;
  transition: transform .2S ease-in;
  transform: ${(props) => (props.isOpen ? 'translateX(0)' : 'translateX(100%)')};
  @media only screen and (max-width: 480px) {
    padding: 20px 10px 10px;
  }
`;

const PlayerSkillFormControl = styled.div`
  margin-bottom: 15px;
`;

const PlayerSkillFormLabel = styled.label`
  color: #fff;
  font-size: 16px;
  margin-bottom: 5px;
`;

const PlayerSkillFormSend = styled.button`
  padding: 10px 16px;
  position: absolute;
  z-index: 21;
  bottom: 0;
  right: 0;
  margin: 20px;
  border: none;
  background: transparent;
  background-image: none;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  color: #ddd;
  border: 1px solid #ddd;
  opacity: 0.9;
  &:hover,
  &:focus {
    opacity: 1;
    outline: none;
  }
`;

const PlayerSkillFormHelper = styled.small`
  color: #fff;
  opacity: 0.8;
  font-size: 12px;
  margin-top: 5px;
`;

export { PlayerSkillSidebar, PlayerSkillFormControl, PlayerSkillFormLabel, PlayerSkillFormHelper, PlayerSkillFormSend };
