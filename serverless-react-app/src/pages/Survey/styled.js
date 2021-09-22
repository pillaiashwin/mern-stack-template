import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 400px;
  margin: auto;
`;

export const QuestionContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.default}px;
`;
