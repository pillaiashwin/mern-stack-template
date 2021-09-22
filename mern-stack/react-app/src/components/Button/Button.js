import React from 'react';
import Spinner from '../Spinner';

import { defaultProps, propTypes } from './props';

import {
  Container,
} from './styled';

const Button = ({
  children,
  isLoading,
  ...props
}) => (
  <Container {...props}>
    {isLoading ? (
      <Spinner />
    ) : children}
  </Container>
);

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
