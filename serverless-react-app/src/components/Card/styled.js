import styled from 'styled-components';

import styles from '../../styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  background-color: transparent;
  border-color: ${styles.color.white};
  border-style: solid;
  border-width: 1px;
  border-radius: 16px;
  cursor: pointer;
`;
