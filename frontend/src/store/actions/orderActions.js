import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_VALIDATE_REQUEST,
  ORDER_VALIDATE_SUCCESS,
  ORDER_VALIDATE_FAIL,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_CALENDAR_FAIL,
  ORDER_CALENDAR_REQUEST,
  ORDER_CALENDAR_SUCCESS
} from '../constants/orderConstants';
import { CART_RESET } from '../constants/cartConstants';
import axios from 'axios';

export const createOrder = order => async(dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.post(`/api/orders`, order, config);

    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data
    });
    
    dispatch({ type: CART_RESET });
    localStorage.removeItem('booking');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

export const validateOrder = order => async(dispatch) => {
  try {
    dispatch({ type: ORDER_VALIDATE_REQUEST });

    const { checkIn, checkOut, hotel, roomId, availableRooms } = order;

    const { data } = await axios.get(
      `/api/orders/validate?checkIn=${checkIn}&checkOut=${checkOut}&hotel=${hotel}&roomId=${roomId}&availableRooms=${availableRooms}`
    );

    dispatch({
      type: ORDER_VALIDATE_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_VALIDATE_FAIL,
      payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
}

export const listMyOrders = () => async(dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_MY_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get(`/api/orders/my-orders`, config);

    dispatch({
      type: ORDER_LIST_MY_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

export const getOrderDetails = id => async(dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

export const payOrder = (orderId, paymentResult) => async(dispatch, getState) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config);

    dispatch({
      type: ORDER_PAY_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    });
  }
};

export const fetchCalendarDaysBookings = (hotel, room) => async(dispatch) => {
  try {
    dispatch({ type: ORDER_CALENDAR_REQUEST });

    const { data } = await axios.get(`/api/orders/calendar/${hotel}/${room}`);

    dispatch({
      type: ORDER_CALENDAR_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: ORDER_CALENDAR_FAIL,
      payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    })
  }
};