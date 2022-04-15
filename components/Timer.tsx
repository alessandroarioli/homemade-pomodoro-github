import styled from "styled-components";
import React from "react";

const StyledTimer = styled.div`
  padding: 30px;
  margin: 15px;
  border-radius: 50%;
  border: 1px solid #e1e0e0;
  font-size: 38px;
  cursor: pointer;
`

export const TimerWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`

export const Timer: React.FC<{ onClick: () => void }> = ({children, onClick}) => (
  <StyledTimer onClick={() => onClick()}>
    {children}
  </StyledTimer>
)