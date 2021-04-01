import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_VALIDATE_REQUEST,
  ORDER_VALIDATE_SUCCESS,
  ORDER_VALIDATE_FAIL,
  ORDER_VALIDATE_RESET
} from '../constants/orderConstants';

export const orderCreateReducer = (state={}, action) => {
  switch(action.type) {
    case ORDER_CREATE_REQUEST:
      return { loading: true }
    case ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload
      }
    case ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload
      }
    default:
      return state;
  }
};

export const orderValidateReducer = (state={}, action) => {
  switch(action.type) {
    case ORDER_VALIDATE_REQUEST:
      return { loading: true }
    case ORDER_VALIDATE_SUCCESS:
      return {
        loading: false,
        success: true,
        data: action.payload
      }
    case ORDER_VALIDATE_FAIL:
      return {
        loading: false,
        error: action.payload
      }
    case ORDER_VALIDATE_RESET:
      return {}
    default:
      return state;
  }
};