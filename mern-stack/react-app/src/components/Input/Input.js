import React, { useCallback } from 'react';

import { defaultProps, propTypes } from './props';

import {
  Container,
} from './styled';

const Input = ({
  onChange,
  ...props
}) => {
  const onChangeInput = useCallback((event) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <Container {...props} onChange={onChangeInput} />
  );
};

Input.propTypes = propTypes;
Input.defaultProps = defaultProps;

export default Input;
