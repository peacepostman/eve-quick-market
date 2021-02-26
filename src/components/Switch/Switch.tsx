import React from 'react';
import { SwitchWrapper, SwitchInput, SwitchLabel, SwitchVisualLabel, SwitchSlider } from './Switch.styled';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  variant?: 'sm' | 'md' | 'lg';
  defaultIsChecked?: boolean;
  isChecked?: boolean;
  isDisabled?: boolean;
}

const Switch = React.forwardRef((props: Props, ref: any) => {
  const {
    variant,
    name,
    value,
    'aria-labelledby': ariaLabelledBy,
    defaultIsChecked,
    isChecked,
    isDisabled,
    onChange,
    onBlur,
    onFocus,
    children,
  } = props;

  const variantDefault = variant ? variant : 'md';

  return (
    <SwitchWrapper>
      <SwitchLabel htmlFor={name} aria-labelledby={ariaLabelledBy} variant={variantDefault}>
        <SwitchInput
          type="checkbox"
          id={name}
          ref={ref}
          name={name}
          value={value}
          defaultChecked={defaultIsChecked}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          checked={isChecked}
          disabled={isDisabled}
          variant={variantDefault}
        />
        <SwitchSlider className="slider" variant={variantDefault} />
      </SwitchLabel>
      <SwitchVisualLabel htmlFor={name}>{children}</SwitchVisualLabel>
    </SwitchWrapper>
  );
});

export default Switch;
