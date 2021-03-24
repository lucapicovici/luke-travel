import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Hotel from '../components/Hotel';
import { listHotels } from '../store/actions/hotelActions';

const HotelListScreen = () => {
  const dispatch = useDispatch();

  const hotelList = useSelector(state => state.hotelList);
  const { loading, error, hotels } = hotelList;

  useEffect(() => {
    dispatch(listHotels());
  }, [dispatch]);

  return(
    <>
    {loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <Row className='hotelListRow'>
        {hotels.map(hotel => (
          <Col key={hotel._id} className='hotelListCol' md={12} lg={9}>
            <Hotel hotel={hotel}/>
          </Col>
        ))}
      </Row>
    )}
    </>
  );
};

export default HotelListScreen;