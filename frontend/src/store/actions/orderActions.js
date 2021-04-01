import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_VALIDATE_REQUEST,
  ORDER_VALIDATE_SUCCESS,
  ORDER_VALIDATE_FAIL
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
    localStorage.removeItem('cartItem');
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