import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Carousel, ButtonGroup, ToggleButton, Form, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import RoomDetails from '../components/RoomDetails';
import Calendar from '../components/Calendar';
import Meta from '../components/Meta';
import { listHotelDetails } from '../store/actions/hotelActions';
import { addToCart } from '../store/actions/cartActions';
import { validateOrder } from '../store/actions/orderActions';
import { fetchCalendarDaysBookings } from '../store/actions/orderActions';
import { ORDER_CALENDAR_RESET, ORDER_VALIDATE_RESET } from '../store/constants/orderConstants';
import initMapQuestMap from '../utils/mapquest';
import {
  getCurrentDay,
  getNextDay,
  getDaysRange
} from '../utils/dates';

const HotelScreen = ({ match, history }) => {
  const hotelId = match.params.id;
  
  const dispatch = useDispatch();
  const location = useLocation();
  
  const hotelDetails = useSelector(state => state.hotelDetails);
  const { loading, error, hotel } = hotelDetails;

  const orderValidate = useSelector(state => state.orderValidate);
  const { 
    loading: loadingValidate, 
    error: errorValidate, 
    success: successValidate
  } = orderValidate;
  
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const orderCalendar = useSelector(state => state.orderCalendar);
  const { 
    loading: loadingCalendar,
    error: errorCalendar,
    success: successCalendar,
    data: dataCalendar
  } = orderCalendar;

  const [roomChecked, setRoomChecked] = useState('');
  const [roomCheckedDetails, setRoomCheckedDetails] = useState({});
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);

  useEffect(() => {
    if (hotel._id !== hotelId && !loading) {
      dispatch(listHotelDetails(hotelId));
      dispatch({ type: ORDER_VALIDATE_RESET });
    }

    if (loading !== undefined && !loading) {
      // @TODO: Set loading to undefined somewhere so this block doesn't run twice

      const qs = queryString.parse(location.search);
      if (qs.room && hotel.roomTypes) {
        // @TODO: refactor if else
        const roomQueryIndex = hotel.roomTypes.findIndex((room) => room._id === qs.room);
        setRoomChecked(hotel.roomTypes[roomQueryIndex]._id);
        setRoomCheckedDetails(hotel.roomTypes[roomQueryIndex]);
      } else {
        setRoomChecked(hotel.roomTypes && hotel.roomTypes[0]._id);
        setRoomCheckedDetails(hotel.roomTypes && hotel.roomTypes[0]);
      }
    }
  }, [dispatch, hotelId, hotel, loading, location]);

  useEffect(() => {
    if (roomChecked && !loading) {
      dispatch(fetchCalendarDaysBookings(hotel._id, roomChecked));
    }
  }, [dispatch, roomChecked, hotel, loading])

  useEffect(() => {
    if (loading !== undefined && !loading) {
      const lat = hotel.location && hotel.location.coordinates[1];
      const lng = hotel.location && hotel.location.coordinates[0];
      const hotelName = hotel.name;
      const hotelType = hotel.type;
      initMapQuestMap(lat, lng, hotelName, hotelType);
    }
  }, [hotel, loading]);

  useEffect(() => {
    // const addDaysToDate = (date, days) => {
    //   let newDate = new Date(date);
    //   newDate.setDate(newDate.getDate() + days);
    //   return newDate;
    // }

    // const getDaysRange = (start, end) => {
    //   start = new Date(start);
    //   end = new Date(end);
    //   let range = 0, currentDate = start;
    //   while (currentDate < end) {
    //     range += 1;
    //     currentDate = addDaysToDate(currentDate, 1);
    //   }
    //   return range;
    // }

    if (successValidate) {
      const booking = {
        checkIn,
        checkOut,
        adults,
        hotel: {
          _id: hotel._id,
          name: hotel.name
        },
        room: {
          _id: roomCheckedDetails._id,
          name: roomCheckedDetails.name
        },
        price: getDaysRange(checkIn, checkOut) * roomCheckedDetails.price
      }
      dispatch(addToCart(booking));
      dispatch({ type: ORDER_VALIDATE_RESET });
      history.push('/login?redirect=shipping');
    }
  }, 
  [
    dispatch, 
    successValidate, 
    checkIn, 
    checkOut, 
    adults, 
    hotel, 
    roomCheckedDetails, 
    history
  ]);

  const findRoomById = id => {
    return hotel.roomTypes.find(room => room._id === id);
  }

  const handleClick = e => {
    setRoomChecked(e.target.value);
    setRoomCheckedDetails(findRoomById(e.target.value));
  }

  // const getCurrentDay = () => {
  //   const today = new Date();
  //   return today.toISOString().split('T')[0];
  // }

  // const getNextDay = (date) => {
  //   if (date) {
  //     date = new Date(date);
  //     date.setDate(date.getDate() + 1);
  //     return date.toISOString().split('T')[0];
  //   }
  // }

  // Verifica disponibilitatea camerei prin apel API
  const checkAvailability = (e) => {
    e.preventDefault();

    if (!userInfo) {
      history.push(`/login?redirect=${location.pathname}`);
    } else {
      const booking = {
        checkIn,
        checkOut,
        hotel: hotel._id,
        roomId: roomCheckedDetails._id
      }
  
      dispatch(validateOrder({
        ...booking, 
        availableRooms: roomCheckedDetails.availableRooms
      }));
    }
  }

  return(
    <>
    <Meta title={hotel.name} />
    <Link className='btn btn-outline-secondary my-3' to='/hotels'>
      Go Back
     </Link>
    {loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <>
      <Row>
        <Col className='hotelScreenTitle'>
          <span id='hotelType'>{hotel.type}</span>
          <span id='hotelName'>{hotel.name}</span>
        </Col>
      </Row>
      <Row>
        <Col className='hotelScreenAddress'>
          <i className="fas fa-map-marker-alt"></i>
          <span> {hotel.location && hotel.location.formattedAddress}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Carousel interval={3000} pause='hover' className='bg-primary' id='hotelCarousel'>
            {hotel.images && hotel.images.map(image => (
              <Carousel.Item key={image._id}>
                <Image src={image.src} alt={hotel.name} fluid />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
      <hr></hr>
      <Row>
        <Col>
          <h6>Choose a room</h6>
        </Col>
      </Row>
      <Row id='roomArea'>
        <Col md={5} lg={5}>
          <ButtonGroup toggle vertical>
            {hotel.roomTypes && hotel.roomTypes.map(room => (
              <ToggleButton
                id='roomToggleBtn'
                key={room._id}
                type="radio"
                variant="secondary"
                name="radio"
                value={room._id}
                checked={roomChecked === room._id}
                onChange={handleClick}
              >
                {room.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </Col>
        <Col md={7} lg={7}>
          <Carousel interval={2000} pause='hover' className='bg-dark' id='roomCarousel'>
            {roomCheckedDetails && roomCheckedDetails.images && roomCheckedDetails.images.map(image => (
              <Carousel.Item key={image._id}>
                <Image src={image.src} alt={hotel.name} fluid />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
      <Row id='bookingArea'>
        <Col lg={3}>
          <Form onSubmit={checkAvailability}>
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
                max={roomCheckedDetails && roomCheckedDetails.peopleCount}
                onChange={(e) => setAdults(e.target.value)}
              />
              <Form.Text className="text-muted">
                Max adults: {roomCheckedDetails && roomCheckedDetails.peopleCount}
              </Form.Text>
            </Form.Group>
            <Button type='submit' variant='info'>
              Check availability
            </Button>
          </Form>
        </Col>
        <Col lg={4}>
          {loadingValidate ? (
              <Loader />
            ) : errorValidate && (
              <Message variant='danger'>{errorValidate}</Message>
          )}
        </Col>
        <Col md={8} lg={5}>
          {loadingCalendar ? (
            <Loader />
          ) : roomCheckedDetails && dataCalendar && (
            <Calendar 
              daysBookings={dataCalendar} 
              availableRooms={roomCheckedDetails.availableRooms}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col md={{order: 'last'}}>
          {roomCheckedDetails && (
            <RoomDetails room={roomCheckedDetails} />
          )}
        </Col>
        <Col md={6}>
          Reviews here
        </Col>
      </Row>
      <Row>
        <Col>
          <div id='map' style={{width: '100%', height: '530px'}}></div>
        </Col>
      </Row>
      </>
    )}
    </>
  )
};

export default HotelScreen;