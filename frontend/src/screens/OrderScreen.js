import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder, listMyOrders } from '../store/actions/orderActions';
import { ORDER_PAY_RESET } from '../store/constants/orderConstants';

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();

  const orderDetails = useSelector(state => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector(state => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    // Calculeaza preturile
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
  
    order.itemsPrice = addDecimals(Number(order.booking.price).toFixed(2));
  }

  useEffect(() => {
    if (!userInfo) {
      history.push(`/login?redirect=${location.pathname}`);
    }

    const addPayPalScript = async() => {
      const { data: clientId } = await axios.get('/api/config/paypal');

      // Adaugare dinamica a scriptului PayPal
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src= `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);  // Pregatire script
      }
      document.body.appendChild(script);
    };

    if (!order || successPay || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    } else if(!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, history, userInfo, order, orderId, successPay, location]);  // ?location

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
    dispatch(listMyOrders());  // Actualizare Redux state dupa plasare comanda
  };

  const deliverHandler = () => {

  }

  const arrangeDate = (date) => {
    let arr = date.split('T');
    arr[1] = arr[1].substring(0, 8);
    return `${arr[0]} at ${arr[1]}`;
  }

  return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message>
    : <>
      <Row>
        <Col md={8}>
          <h4 id='orderId'>Order {order._id}</h4>
          <ListGroup variant='flush'>
            <ListGroup.Item id='shippingDetails'>
              <h3>Shipping</h3>
              <p>
                Name: <strong>{order.user.name}</strong>
              </p>
              <p>
                Email:{' '}
                <strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></strong>
              </p>
              <p>Address: <strong>{order.shippingAddress.address}</strong></p>
              <p>City: <strong>{order.shippingAddress.city}</strong></p>
              <p>Postal Code: <strong>{order.shippingAddress.postalCode}</strong></p>
              <p>Country: <strong>{order.shippingAddress.country}</strong></p>

              {order.isDelivered ? (
                <Message variant='success'>Delivered on {order.deliveredAt}</Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Payment Method</h3>
              <p>
                Method: <strong>{order.paymentMethod}</strong>
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {arrangeDate(order.paidAt)}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Booking</h3>
              {Object.keys(order.booking).length === 0 ? <Message>Order is empty</Message>
              : (
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    Room: <strong>{order.booking.room.name}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Hotel: <strong>{order.booking.hotel.name}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Check-in: <strong>{order.booking.checkIn.substring(0, 10)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Check-out: <strong>{order.booking.checkOut.substring(0, 10)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    Adults: <strong>{order.booking.adults}</strong>
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
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? <Loader /> : (
                    <PayPalButton 
                      amount={order.totalPrice} 
                      onSuccess={successPaymentHandler} 
                    />
                  )}
                </ListGroup.Item>
              )}

              {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-block' onClick={deliverHandler}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
                    
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
}

export default OrderScreen
