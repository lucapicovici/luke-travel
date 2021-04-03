import { 
  CART_ADD_ITEM, 
  CART_REMOVE_ITEM,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_SHIPPING_ADDRESS
} from '../constants/cartConstants';

export const addToCart = (booking) => async(dispatch, getState) => {
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: booking.adults,
      hotel: {
        _id: booking.hotel._id,
        name: booking.hotel.name
      },
      room: {
        _id: booking.room._id,
        name: booking.room.name
      },
      price: booking.price
    }
  });

  localStorage.setItem('booking', JSON.stringify(getState().cart.booking));
};

export const removeFromCart = () => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM });

  localStorage.setItem('booking', JSON.stringify(getState().cart.booking));
};

export const saveShippingAddress = data => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS,
    payload: data
  });

  localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = data => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD,
    payload: data
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};