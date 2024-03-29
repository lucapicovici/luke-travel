import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Meta from '../components/Meta';
import { createOrder, listMyOrders } from '../store/actions/orderActions';
import { Link, useLocation } from 'react-router-dom';
import { ORDER_CREATE_RESET } from '../store/constants/orderConstants';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const cart = useSelector(state => state.cart);

  const orderCreate = useSelector(state => state.orderCreate);
  const { order, success, error } = orderCreate;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  // Calculeaza preturile
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  // Subtotal al tuturor itemilor, incluzand eventualele transporturi de la aeroport, sau inchiriere masina
  cart.itemsPrice = addDecimals(Number(cart.booking.price).toFixed(2));

  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));

  cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.taxPrice)).toFixed(2);

  useEffect(() => {
    if (success) {
      history.push(`/orders/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
    // eslint-disable-next-line
  }, [dispatch, history, success]);

  const placeOrderHandler = () => {
    dispatch(createOrder({
      booking: cart.booking,
      shippingAddress: cart.shippingAddress,
      paymentMethod: cart.paymentMethod,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice
    }));
    dispatch(listMyOrders());  // Actualizare Redux state dupa plasare comanda
  }

  return (
    <>
      <Link className='btn btn-outline-secondary my-3' to='/payment'>
        Go Back
      </Link>
      <Meta title='Place Order' />
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>Client</h3>
              <p>Address: <strong>{cart.shippingAddress.address}</strong></p>
              <p>City: <strong>{cart.shippingAddress.city}</strong></p>
              <p>Postal Code: <strong>{cart.shippingAddress.postalCode}</strong></p>
              <p>Country: <strong>{cart.shippingAddress.country}</strong></p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <p>
                Method: <strong>{cart.paymentMethod}</strong>
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Booking</h3>
              {Object.keys(cart.booking).length === 0 ? <Message>No ongoing reservation.</Message>
              : (
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    Room: {' '}
                    <Link to={`/hotels/${cart.booking.hotel._id}?room=${cart.booking.room._id}`}>
                      <strong>{cart.booking.room.name}</strong>
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Hotel: {' '}
                    <Link to={`/hotels/${cart.booking.hotel._id}`}>
                      <strong>{cart.booking.hotel.name}</strong>
                    </Link>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Check-in: <strong>{cart.booking.checkIn}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Check-out: <strong>{cart.booking.checkOut}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Adults: <strong>{cart.booking.adults}</strong>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>Order Summary</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Subtotal</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {error && (
                <ListGroup.Item>
                  <Message variant='danger'>{error}</Message>
                </ListGroup.Item>
              )}

              {!userInfo ? (
                <ListGroup.Item>
                  <Link to={`/login?redirect=${location.pathname}`} className='btn btn-warning btn-block'>
                    Please log in first
                  </Link>
                </ListGroup.Item>
              ) : (
                <ListGroup.Item>
                  <Button 
                    type='button' 
                    className='btn-block' 
                    disabled={Object.keys(cart.booking).length === 0} 
                    onClick={placeOrderHandler}
                  >
                    Place Order
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen;