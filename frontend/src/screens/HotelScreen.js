import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Carousel, ButtonGroup, ToggleButton, Form, Button, ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Message from '../components/Message';
import Loader from '../components/Loader';
import RoomDetails from '../components/RoomDetails';
import Calendar from '../components/Calendar';
import Meta from '../components/Meta';
import Rating from '../components/Rating';
import { listHotelDetails, createHotelReview, deleteHotelReview } from '../store/actions/hotelActions';
import { addToCart } from '../store/actions/cartActions';
import { validateOrder } from '../store/actions/orderActions';
import { fetchCalendarDaysBookings } from '../store/actions/orderActions';
import { ORDER_VALIDATE_RESET } from '../store/constants/orderConstants';
import initMapQuestMap from '../utils/mapquest';
import {
  getCurrentDay,
  getNextDay,
  getDaysRange
} from '../utils/dates';
import { HOTEL_CREATE_REVIEW_RESET, HOTEL_DELETE_REVIEW_RESET } from '../store/constants/hotelConstants';

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

  const hotelReviewCreate = useSelector(state => state.hotelReviewCreate);
  const { success: successHotelReview, error: errorHotelReview } = hotelReviewCreate;

  const hotelReviewDelete = useSelector(state => state.hotelReviewDelete);
  const { loading: loadingReviewDelete, success: successReviewDelete, error: errorReviewDelete } = hotelReviewDelete;

  const searchCriteria = useSelector(state => state.searchCriteria);
  const { checkIn: checkInSearch, checkOut: checkOutSearch, adults: adultsSearch } = searchCriteria;

  const [roomChecked, setRoomChecked] = useState('');
  const [roomCheckedDetails, setRoomCheckedDetails] = useState({});
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (hotel._id !== hotelId && !loading) {
      dispatch(listHotelDetails(hotelId));
      dispatch({ type: ORDER_VALIDATE_RESET });
      dispatch({ type: HOTEL_CREATE_REVIEW_RESET });
      if (checkInSearch && checkOutSearch && adultsSearch) {
        setCheckIn(checkInSearch);
        setCheckOut(checkOutSearch);
        setAdults(adultsSearch);
      }
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
  }, [dispatch, hotelId, hotel, loading, location, checkInSearch, checkOutSearch, adultsSearch]);

  useEffect(() => {
    // Recenzii hotel
    if (successHotelReview) {
      alert('Review Submitted!');
      setRating(0);
      setComment('');
      dispatch({ type: HOTEL_CREATE_REVIEW_RESET });
      dispatch(listHotelDetails(hotelId));
    }
  }, [dispatch, hotelId, successHotelReview]);

  useEffect(() => {
    if (successReviewDelete) {
      setRating(0);
      setComment('');
      dispatch(listHotelDetails(hotelId));
      dispatch({ type: HOTEL_DELETE_REVIEW_RESET });
      dispatch({ type: HOTEL_CREATE_REVIEW_RESET });
    }
  }, [dispatch, hotelId, successReviewDelete]);

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

  const proceedToCheckout = () => {
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
  }

  // useEffect(() => {
  //   if (successValidate) {
  //     const booking = {
  //       checkIn,
  //       checkOut,
  //       adults,
  //       hotel: {
  //         _id: hotel._id,
  //         name: hotel.name
  //       },
  //       room: {
  //         _id: roomCheckedDetails._id,
  //         name: roomCheckedDetails.name
  //       },
  //       price: getDaysRange(checkIn, checkOut) * roomCheckedDetails.price
  //     }
  //     dispatch(addToCart(booking));
  //     dispatch({ type: ORDER_VALIDATE_RESET });
  //     history.push('/login?redirect=shipping');
  //   }
  // }, 
  // [
  //   dispatch, 
  //   successValidate, 
  //   checkIn, 
  //   checkOut, 
  //   adults, 
  //   hotel, 
  //   roomCheckedDetails, 
  //   history
  // ]);

  const findRoomById = id => {
    return hotel.roomTypes.find(room => room._id === id);
  }

  const handleClick = e => {
    setRoomChecked(e.target.value);
    setRoomCheckedDetails(findRoomById(e.target.value));
  }

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

  const reviewSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(createHotelReview(hotelId, {
      rating,
      comment
    }));
  };

  const reviewDelete = (reviewId) => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(deleteHotelReview(hotelId, reviewId));
    }
  }

  const RatingNumber = styled.div`
    width: 30px;
    height: 30px;
    padding: 19px;
    background-color: #4fb7f0;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 15%;
    font-size: 1.5em;
    color: white;
  `;

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
        <Col className='hotelScreenTitle' style={{display: 'flex', justifyContent: 'space-between'}}>
          <div style={{alignItems: 'center', display: 'flex'}}>
            <span id='hotelType'>{hotel.type}</span>
            <span id='hotelName'>{hotel.name}</span>
          </div>

          <div style={{alignItems: 'center', display: 'flex'}}>
            <RatingNumber>{hotel.rating && hotel.rating.toFixed(1)}</RatingNumber>
            <Rating value={hotel.rating} text={`${hotel.numReviews} reviews`} />
          </div>
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
          <h5>Choose a room</h5>
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
            ) : errorValidate ? (
              <Message 
                variant='danger' 
                style={{marginTop: '112px', height: '36.5px', display: 'flex', alignItems: 'center'}}
              >
                {errorValidate}
              </Message>
            ) : successValidate && (
              <Message style={{marginTop: '112px', height: '36.5px', display: 'flex', alignItems: 'center'}}>
                Room Available.&nbsp;Proceed to&nbsp;
                <span 
                  onClick={() => proceedToCheckout()}
                  style={{textDecoration: 'underline', cursor: 'pointer'}}
                >
                  Checkout
                </span>
              </Message>
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
      <Row style={{marginBottom: '50px'}}>
        <Col md={{order: 'last'}}>
          {roomCheckedDetails && (
            <RoomDetails room={roomCheckedDetails} />
          )}
        </Col>
        <Col md={6}>
          <h5>Reviews</h5>
          {hotel.reviews && hotel.reviews.length === 0 && <Message>No Reviews</Message>}
          {userInfo && userInfo.isAdmin && errorReviewDelete && (
            <Message variant='danger'>{errorReviewDelete}</Message>
          )}
          <ListGroup variant='flush'>
            {hotel.reviews && hotel.reviews.map(review => (
              <ListGroup.Item key={review._id}>
                {userInfo && userInfo.isAdmin ? (
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <strong>{review.name}</strong>
                    <Button variant='danger' className='btn-sm' onClick={() => reviewDelete(review._id)}>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </div>
                ) : (
                  <strong>{review.name}</strong>
                )}
                <Rating value={review.rating} />
                <p>{review.createdAt.substring(0, 10)}</p>
                <p style={{wordBreak: 'break-word'}}>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h5>Write a Customer Review</h5>
              {errorHotelReview && <Message variant='danger'>{errorHotelReview}</Message>}
              {userInfo ? (
                <Form onSubmit={reviewSubmitHandler}>
                  <Form.Group controlId='rating'>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control 
                      as='select' 
                      value={rating} 
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value=''>Select...</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId='comment'>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as='textarea'
                      row='3'
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button type='submit' variant='primary'>
                    Submit
                  </Button>
                </Form>
              ) : (
                <Message>
                  Please <Link to='/login'>sign in</Link>{' '}
                  to write a review
                </Message>
              )}
            </ListGroup.Item>
          </ListGroup>
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