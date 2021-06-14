import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Hotel from '../components/Hotel';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { listHotels } from '../store/actions/hotelActions';

const HotelListScreen = ({ match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const hotelList = useSelector(state => state.hotelList);
  const { loading, error, hotels, page, pages } = hotelList;

  const searchCriteria = useSelector(state => state.searchCriteria);
  const { checkIn, checkOut, adults } = searchCriteria;

  useEffect(() => {
    dispatch(listHotels(pageNumber));
  }, [dispatch, pageNumber]);

  return(
    <>
    <Meta title='Luke Travel - Showing Results'/>
    {loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <>
      <h5>Showing results for {checkIn} -{'>'} {checkOut} with {adults} adults</h5>
      <Row className='hotelListRow'>
        {hotels.map(hotel => (
          <Col key={hotel._id} className='hotelListCol' md={12} lg={9}>
            <Hotel hotel={hotel}/>
          </Col>
        ))}
      </Row>
      <Paginate pages={pages} page={page} />
      </>
    )}
    </>
  );
};

export default HotelListScreen;