import styled, { keyframes } from 'styled-components';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  animation: ${rotate360} 1s linear infinite;
  transform: translateZ(0);
  border-top: 3px solid rgba(255, 255, 255, 1);
  border-right: 3px solid rgba(255, 255, 255, 1);
  border-bottom: 3px solid rgba(255, 255, 255, 1);
  border-left: 3px solid rgba(255, 255, 255, 0);
  background: transparent;
  width: 18px;
  height: 18px;
  border-radius: 50%;
`;
