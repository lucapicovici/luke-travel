import React from 'react';
import styled from 'styled-components';

const StyledDay = styled.div`
  width: 14.2%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  ${props => props.isToday && 'border: 1px solid black'}
  ${props => props.color && `background-color: ${props.color}`}
`;

const Day = ({ day, isToday, color }) => {
  return (
    <StyledDay isToday={isToday} color={color}>
      {day}
    </StyledDay>
  )
}

export default Day
