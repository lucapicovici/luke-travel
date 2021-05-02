import React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Day from '../components/Day';
import cloneDeep from 'lodash/cloneDeep';

const Frame = styled.div`
  width: 400px;
  border: 1px solid lightgrey;
  box-shadow: 2px 2px 2px #eee;
`;

const Header = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding: 10px 10px 5px 10px;
  display: flex;
  justify-content: space-between;
  background-color: #f5f6fa;
`;

const Button = styled.div`
  cursor: pointer;
`;

const Body = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const DayOfWeek = styled.div`
  width: 14.2%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Calendar = ({ bookings, availableRooms }) => {
  const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const DAYS_OF_THE_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const today = new Date();
  const [date, setDate] = useState(today);
  const [day, setDay] = useState(date.getDate());
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [startDay, setStartDay] = useState(getStartDayOfMonth(date));

  useEffect(() => {
    setDay(date.getDate());
    setMonth(date.getMonth());
    setYear(date.getFullYear());
    setStartDay(getStartDayOfMonth(date));
  }, [date]);

  // Transform to const
  function getStartDayOfMonth(date) {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return startDate === 0 ? 7 : startDate;
  }

  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  const days = isLeapYear(date.getFullYear()) ? DAYS_LEAP : DAYS;

  const equalDates = (d1, d2) => {
    return d1.getDate() === d2.getDate()
      && d1.getMonth() === d2.getMonth()
      && d1.getFullYear() === d2.getFullYear();
  }

  const constructArrayOfDays = () => {
    const arr = Array(days[month] + (startDay - 1))
      .fill(null)
      .map((_, index) => {
        const d = index - (startDay - 2);
        let currentDate;
        if (d > 0) {
          currentDate = new Date(year, month, d);
        }

        let dayColor = 'white';

        return (
          <Day
            key={index}
            isToday={d > 0 && equalDates(currentDate, today)}
            onClick={() => setDate(new Date(year, month, d))}
            day={d > 0 ? d : ''}
            info={'a'}
            color={dayColor}
          />
        )
      });
    return arr;
  }

  const constructFinalArray = () => {
    const arr = constructArrayOfDays();

    for (let i = 0; i < arr.length; i++) {
      // Construieste data curenta
      if (arr[i].props.day >= 1) {
        let currDate = new Date(year, month, arr[i].props.day);
        console.log(currDate)
        
        let exists = -1;
        for (let j = 0; j < bookings.length; j++) {
          console.log(`j=${j}`)

          if (bookings[j].date.getYear() === currDate.getYear()) {
            console.log('BAAAAAAAAAA')
            // Deep clone arr[i]
            let aux = cloneDeep(arr[i]);
  
            // Stabileste culoarea zilei
            if (bookings[exists].bookings >= availableRooms) {
              // Seteaza pe rosu
              aux.props.color = 'red';
            } else {
              // Seteaza pe galben
              aux.props.color = 'yellow';
            }
  
            // Actualizeaza elementul cu ziua
            arr[i] = aux;
            console.log(`aux is ${aux}`)
          }
        }
        // console.log(`exists is ${exists}`)
      }
    }
    console.log(arr)

    return arr;
  }


  return (
    <Frame>
      <Header>
        <Button onClick={() => setDate(new Date(year, month-1, day))}>Prev</Button>
        <div>
          {MONTHS[month]} {year}
        </div>
        <Button onClick={() => setDate(new Date(year, month+1, day))}>Next</Button>
      </Header>
      <Body>
        {DAYS_OF_THE_WEEK.map(d => (
          <DayOfWeek key={d}>
            <strong>{d}</strong>
          </DayOfWeek>
        ))}
        {bookings && availableRooms && constructFinalArray() }
      </Body>
    </Frame>
  );
}

export default Calendar;