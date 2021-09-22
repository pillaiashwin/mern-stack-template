import styled from 'styled-components';

import Button from '../../components/Button';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.div`
  font-size: 36px;
  margin-bottom: ${({ theme }) => theme.spacing.two}px;
`;

export const SurveyContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.two}px;
`;

export const LogoutButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.two}px;
`;

export const SurveyButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.spacing.two}px;
`;
