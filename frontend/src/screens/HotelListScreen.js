import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Hotel from '../components/Hotel';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { listHotels } from '../store/actions/hotelActions';
import { SEARCH_CRITERIA } from '../store/constants/hotelConstants';
import { getCurrentDay, getNextDay } from '../utils/dates';

const HotelListScreen = ({ match, history }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [type, setType] = useState('Hotel');

  const hotelList = useSelector(state => state.hotelList);
  const { loading, error, hotels, page, pages } = hotelList;

  const searchCriteria = useSelector(state => state.searchCriteria);
  const { 
    checkIn: checkInSearch, 
    checkOut: checkOutSearch, 
    adults: adultsSearch,
    type: typeSearch
  } = searchCriteria;

  useEffect(() => {
    dispatch(listHotels(pageNumber, typeSearch));

    if (checkInSearch) setCheckIn(checkInSearch);
    if (checkOutSearch) setCheckOut(checkOutSearch);
    if (adultsSearch) setAdults(adultsSearch);
    if (typeSearch) setType(typeSearch);
  }, 
  [
    dispatch,
    pageNumber, 
    checkInSearch, 
    checkOutSearch, 
    adultsSearch,
    typeSearch
  ]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch({ 
      type: SEARCH_CRITERIA,
      payload: {
        checkIn,
        checkOut,
        adults,
        type
      }
    });
    localStorage.setItem('searchCriteria', JSON.stringify({ checkIn, checkOut, adults, type }));
  }

  return(
    <>
    <Meta title='Luke Travel - Showing Results'/>
    {loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <>
      <Row>
        <Col lg={4} xl={3}>
          <Card style={{ width: '100%' }}>
            <Card.Body>
              <Card.Title>Showing results for:</Card.Title>
              <Form onSubmit={submitHandler}>
                <Form.Group>
                  <Form.Label>Check In</Form.Label>
                  <Form.Control 
                    type='date'
                    name='checkIn'
                    required
                    min={getCurrentDay()}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Check Out</Form.Label>
                  <Form.Control 
                    type='date'
                    name='checkOut'
                    required
                    disabled={!checkIn}
                    min={getNextDay(checkIn)}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Adults</Form.Label>
                  <Form.Control
                    type='number' 
                    placeholder='0'
                    required
                    value={adults}
                    min='1'
                    max='10'
                    onChange={(e) => setAdults(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Control 
                    as="select"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value='Hotel'>Hotel</option>
                    <option value='Guest House'>Guest House</option>
                  </Form.Control>
                </Form.Group>
                <Button type='submit' variant='info'>
                  Search
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={8} xl={9}>
          <Row className='hotelListRow'>
            {hotels.map(hotel => (
              <Col key={hotel._id} className='hotelListCol'>
                <Hotel hotel={hotel}/>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      <Paginate pages={pages} page={page} />
      </>
    )}
    </>
  );
};

export default HotelListScreen;