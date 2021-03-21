import {
  HOTEL_LIST_REQUEST,
  HOTEL_LIST_SUCCESS,
  HOTEL_LIST_FAIL
} from '../constants/hotelConstants';
import axios from 'axios';

export const listHotels = () => async(dispatch) => {
  try {
    dispatch({ type: HOTEL_LIST_REQUEST });

    const { data } = await axios.get('/api/hotels');
    dispatch({
      type: HOTEL_LIST_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: HOTEL_LIST_FAIL,
      payload: 
        error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message
    });
  }
};