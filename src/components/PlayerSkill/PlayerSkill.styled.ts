import styled from "styled-components";

const PlayerSkillButton = styled.button<{
  isOpen: boolean;
}>`
  position: ${(props) => (props.isOpen ? "fixed" : "absolute")};
  z-index: 9;
  top: 0;
  right: 0;
  margin: 20px;
  border: none;
  background: transparent;
  background-image: none;
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  opacity: 0.9;
  &:hover,
  &:focus {
    opacity: 1;
    outline: none;
  }

  @media only screen and (max-width: 480px) {
    margin: 10px;
  }
`;

const PlayerSkillSidebar = styled.div<{
  isOpen: boolean;
}>`
  position: fixed;
  width: 420px;
  max-width: 100%;
  background-color: rgba(15, 32, 39, 1);
  top 0;
  right: 0;
  bottom: 0;
  z-index: 8;
  padding: 80px 20px 20px;
  transition: transform .2S ease-in;
  transform: ${(props) =>
    props.isOpen ? "translateX(0)" : "translateX(100%)"};
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
  }
`;

export {
  PlayerSkillButton,
  PlayerSkillSidebar,
  PlayerSkillFormControl,
  PlayerSkillFormLabel,
  PlayerSkillFormSend,
};
