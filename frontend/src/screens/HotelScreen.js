import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Carousel, Container, Card, ListGroup, ButtonGroup, ToggleButton } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import RoomDetails from '../components/RoomDetails';
import { listHotelDetails } from '../store/actions/hotelActions';

const HotelScreen = ({ match }) => {
  const hotelId = match.params.id;

  const dispatch = useDispatch();
  
  const hotelDetails = useSelector(state => state.hotelDetails);
  const { loading, error, hotel } = hotelDetails;
  
  const [roomChecked, setRoomChecked] = useState('');
  const [roomCheckedDetails, setRoomCheckedDetails] = useState({});

  useEffect(() => {
    if (hotel._id !== hotelId) {
      dispatch(listHotelDetails(hotelId));
    }
    if (!loading) {
      setRoomChecked(hotel.roomTypes && hotel.roomTypes[0]._id);
      setRoomCheckedDetails(hotel.roomTypes && hotel.roomTypes[0]);
    }
  }, [dispatch, hotelId, hotel, loading]);

  const findRoomById = id => {
    return hotel.roomTypes.find(room => room._id === id);
  }

  const handleClick = e => {
    setRoomChecked(e.target.value);
    setRoomCheckedDetails(findRoomById(e.target.value));
  }

  return(
    <>
    <Link className='btn btn-outline-secondary my-3' to='/'>
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
          <span> {hotel.address}</span>
        </Col>
      </Row>
      <Row>
        <Col>
          <Carousel interval={4000} pause='hover' className='bg-primary' id='hotelCarousel'>
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
      <Row>
        <Col md={5} lg={3}>
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
        <Col md={7} lg={5}>
          <Carousel interval={100} pause='hover' className='bg-dark' id='roomCarousel'>
            {roomCheckedDetails && roomCheckedDetails.images && roomCheckedDetails.images.map(image => (
              <Carousel.Item key={image._id}>
                <Image src={image.src} alt={hotel.name} fluid />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
        <Col md={12} lg={4}>
          {roomCheckedDetails && (
            <RoomDetails room={roomCheckedDetails} />
          )}
        </Col>
      </Row>
      </>
    )}
    </>
  )
};

export default HotelScreen;