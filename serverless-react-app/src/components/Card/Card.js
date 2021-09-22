import React from 'react';

import { defaultProps, propTypes } from './props';

import {
  Container,
} from './styled';

const Card = ({
  children,
  ...props
}) => {
  return (
    <Container {...props}>
      {children}
    </Container>
  );
};

Card.propTypes = propTypes;
Card.defaultProps = defaultProps;

export default Card;
