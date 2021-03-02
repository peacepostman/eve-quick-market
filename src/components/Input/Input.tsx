import React from 'react';
import InputStyled from './Input.styled';

const Input = (props: any, ref: any) => {
  return <InputStyled ref={ref} {...props} />;
};

export default React.forwardRef(Input);
