import styled from 'styled-components';

import styles from '../../styles';

export const Container = styled.input`
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing.default}px;
  padding-bottom: ${({ theme }) => theme.spacing.default}px;
  padding-left: ${({ theme }) => theme.spacing.half}px;
  padding-right: ${({ theme }) => theme.spacing.half}px;
  background-color: ${styles.color.white};
  color: ${styles.color.black};
  border-radius: 4px;
  border-width: 2px;
  border-style: solid;
  border-color: ${styles.color.black};
  height: 24px;
  color: ${styles.color.black};

  ::placeholder {
    color: ${styles.color.gray};
  }
`;
