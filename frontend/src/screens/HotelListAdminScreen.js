import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import Hotel from '../components/Hotel';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';
import { listHotels, deleteHotel } from '../store/actions/hotelActions';

const HotelListAdmin = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const hotelList = useSelector(state => state.hotelList);
  const { loading, error, hotels, page, pages } = hotelList;

  const hotelDelete = useSelector(state => state.hotelDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = hotelDelete;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listHotels(pageNumber));
    } else {
      history.push('/login');
    }
  }, [userInfo, dispatch, history, successDelete, pageNumber]);

  const deleteHandler = (id) => {
    if (window.confirm('Delete hotel?')) {
      dispatch(deleteHotel(id));
    }
  };

  return(
    <>
    <Meta title='Admin Hotel List' />
    {loadingDelete ? <Loader /> : errorDelete && <Message variant='danger'>{errorDelete}</Message>}

    {loading ? (
      <Loader />
    ) : error ? (
      <Message variant='danger'>{error}</Message>
    ) : (
      <>
      <h4>Admin Hotel List</h4>
      <Row className='hotelListRow'>
        <Row>
          {hotels.map(hotel => (
            <>
            <Col key={hotel._id} className='hotelListCol' md={9}>
              <Hotel hotel={hotel}/>
            </Col>
            <Col md={3} className='hotelListRightCol'>
              <LinkContainer to={`/admin/hotel/${hotel._id}/edit`}>
                <Button variant='light' className='btn-lg'>
                  <i className='fas fa-edit'></i>
                </Button>
              </LinkContainer>
              <Button variant='danger' className='btn-lg' onClick={() => deleteHandler(hotel._id)}>
                <i className='fas fa-trash'></i>
              </Button>
            </Col>
            </>
          ))}
        </Row>
      </Row>
      <Paginate pages={pages} page={page} />
      </>
    )}
    </>
  );
}

export default HotelListAdmin;