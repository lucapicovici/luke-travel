import {
  HOTEL_LIST_REQUEST,
  HOTEL_LIST_SUCCESS,
  HOTEL_LIST_FAIL,
  HOTEL_DETAILS_REQUEST,
  HOTEL_DETAILS_SUCCESS,
  HOTEL_DETAILS_FAIL,
  HOTEL_DELETE_FAIL,
  HOTEL_DELETE_REQUEST,
  HOTEL_DELETE_SUCCESS
} from '../constants/hotelConstants';
import axios from 'axios';

export const listHotels = (pageNumber='') => async(dispatch) => {
  try {
    dispatch({ type: HOTEL_LIST_REQUEST });

    const { data } = await axios.get(`/api/hotels?pageNumber=${pageNumber}`);

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

export const listHotelDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: HOTEL_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/hotels/${id}`);

    dispatch({
      type: HOTEL_DETAILS_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: HOTEL_DETAILS_FAIL,
      payload: 
        error.response && error.response.data.message 
        ? error.response.data.message 
        : error.message
    });
  }
};

export const deleteHotel = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: HOTEL_DELETE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    };

    await axios.delete(`/api/hotels/${id}`, config);

    dispatch({ type: HOTEL_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: HOTEL_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    })
  }
};