import { string } from 'prop-types';

export const propTypes = {
  name: string,
  description: string,
  imageUrl: string,
  price: string,
};

export const defaultProps = {
  name: '',
  description: '',
  imageUrl: '',
  price: '',
};