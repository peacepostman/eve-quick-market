import styled from "styled-components";

const SystemCardAddStyled = styled.button`
  padding: 10px 8px;
  color: #fff;
  align-self: center;
  margin-top: 20px;
  background-color: #0f2027;
  border: 1px solid #0f2027;
  border-radius: 4px;
  font-size: 14px !important;
  font-weight: bold;
  line-height: 1.428571429;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  background-image: none;
  user-select: none;
  transition: box-shadow 0.2s ease-in;
  outline: none;

  &:hover {
    box-shadow: 0 0 0px 3px rgba(15, 32, 39, 0.6);
  }

  &:focus {
    box-shadow: 0 0 0px 3px rgba(15, 32, 39, 0.8);
  }
`;

export default SystemCardAddStyled;
