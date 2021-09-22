import styled, { css } from 'styled-components';

import styles from '../../styles';

export const primaryButtonStyles = css`
  background-color: ${styles.color.primary};
  color: ${styles.color.white};
  border-color: ${styles.color.primary};
`;

export const secondaryButtonStyles = css`
  background-color: transparent;
  color: ${styles.color.primary};
  border-color: ${styles.color.primary};
`;

export const tertiaryButtonStyles = css`
  background-color: transparent;
  color: ${styles.color.primary};
  border-color: ${styles.color.primary};
`;

export const Container = styled.button`
  ${({ variant }) => {
    switch(variant) {
      case 'primary':
        return primaryButtonStyles;
      case 'secondary':
        return secondaryButtonStyles;
      case 'tertiary':
        return tertiaryButtonStyles;
      default:
        return primaryButtonStyles;
    }
  }}
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-family: Audiowide;
  border-radius: 4px;
  border-style: solid;
  border-width: 2px;
  cursor: pointer;
  height: 36px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  width: 100%;
`;
