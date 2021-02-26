import styled from 'styled-components';

type size = 'sm' | 'md' | 'lg';

interface Props {
  readonly variant: size;
}

function returnSize(size: size) {
  switch (size) {
    case 'sm':
      return {
        width: 29,
        height: 16,
        spacing: 2,
      };
    case 'md':
      return {
        width: 40,
        height: 22,
        spacing: 2,
      };
    case 'lg':
      return {
        width: 60,
        height: 34,
        spacing: 4,
      };
  }
}

const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const SwitchLabel = styled.label<Props>`
  position: relative;
  display: inline-flex;
  width: ${(props) => returnSize(props.variant).width + 'px'};
  min-width: ${(props) => returnSize(props.variant).width + 'px'};
  height: ${(props) => returnSize(props.variant).height + 'px'};
  outline: none;
  margin-right: 10px;
`;

const SwitchSlider = styled.div<Props>`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ff005c;
  transition: 0.2s;
  border-radius: ${(props) => returnSize(props.variant).height + 'px'};

  :before {
    position: absolute;
    content: '';
    height: ${(props) => {
      const size = returnSize(props.variant);
      return size.height - size.spacing * 2 + 'px';
    }};
    width: ${(props) => {
      const size = returnSize(props.variant);
      return size.height - size.spacing * 2 + 'px';
    }};
    left: ${(props) => returnSize(props.variant).spacing + 'px'};
    bottom: ${(props) => returnSize(props.variant).spacing + 'px'};
    background-color: white;
    transition: 0.2s ease;
    border-radius: 50%;
  }
`;

const SwitchInput = styled.input<Props>`
  border: 0px;
  clip: rect(0px, 0px, 0px, 0px);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0px;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;

  :focus + .slider {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }

  :checked + .slider {
    background-color: #4fb322;
  }

  :checked + .slider:before {
    transform: translateX(
      ${(props) => {
        const size = returnSize(props.variant);
        return size.height - size.spacing * 2 + 'px';
      }}
    );
  }
`;

const SwitchVisualLabel = styled.label`
  color: #b3bbc0;
`;

export { SwitchWrapper, SwitchLabel, SwitchVisualLabel, SwitchInput, SwitchSlider };
