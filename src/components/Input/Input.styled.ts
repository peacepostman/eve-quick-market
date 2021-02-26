import styled from 'styled-components';

const InputStyled = styled.input`
  display: block;
  width: 100%;
  padding: 10px 12px;
  color: #fff;
  background-color: rgb(19, 36, 44);
  border: 1px solid rgba(255, 255, 255, 0.6);
  &:hover {
    border-color: rgba(255, 255, 255, 0.8);
  }
  &:focus {
    border-color: #fff;
    outline: none;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

export default InputStyled;
