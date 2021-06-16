import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Col, Form, Row, Button } from 'react-bootstrap';
import Meta from '../components/Meta';
import { getCurrentDay, getNextDay } from '../utils/dates';
import { SEARCH_CRITERIA } from '../store/constants/hotelConstants';

const HomeScreen = ({ history }) => {
  const dispatch = useDispatch();

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);

  const submitHandler = () => {
    dispatch({ 
      type: SEARCH_CRITERIA,
      payload: {
        checkIn,
        checkOut,
        adults,
        type: 'Hotel'
      }
    });
    localStorage.setItem('searchCriteria', JSON.stringify({ checkIn, checkOut, adults, type: 'Hotel' }));
    history.push('/hotels');
  }

  return (
    <>
    <Meta />
    <Row className='homeScreenTitleRow'>
      <Col>
        <h2 id='homeScreenTitleHeader'>When do you want to travel?</h2>
      </Col>
    </Row>
    <Row className='homeScreenRow'>
      <Col>
        <Form onSubmit={submitHandler} id='homeScreenForm'>
          <Form.Group id='homeScreenCheckIn'>
            <Form.Label>Check In</Form.Label>
            <Form.Control className='homeScreenControls'
              type='date'
              name='checkIn'
              required
              min={getCurrentDay()}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </Form.Group>
          <Form.Group id='homeScreenCheckOut'>
            <Form.Label>Check Out</Form.Label>
            <Form.Control className='homeScreenControls'
              type='date'
              name='checkOut'
              required
              disabled={!checkIn}
              min={getNextDay(checkIn)}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </Form.Group>
          <Form.Group id='homeScreenAdults'>
            <Form.Label>Adults</Form.Label>
            <Form.Control className='homeScreenControls'
              type='number' 
              placeholder='0'
              required
              value={adults}
              min='1'
              max='10'
              onChange={(e) => setAdults(e.target.value)}
            />
          </Form.Group>
          <Button type='submit' variant='info' id='homeScreenSearch'>
            Search
          </Button>
        </Form>
      </Col>
    </Row>
    </>
  )
}

export default HomeScreen
