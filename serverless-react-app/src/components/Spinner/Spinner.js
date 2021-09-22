import React from 'react';

import { defaultProps, propTypes } from './props';

import {
  Container,
} from './styled';

const Spinner = (props) => (
  <Container {...props} />
);

Spinner.propTypes = propTypes;
Spinner.defaultProps = defaultProps;

export default Spinner;
