import { 
  CART_ADD_ITEM, CART_REMOVE_ITEM
} from '../constants/cartConstants';

export const addToCart = (booking) => async(dispatch, getState) => {
  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: booking.adults,
      hotel: booking.hotel,
      roomId: booking.roomId,
      price: booking.price
    }
  });

  localStorage.setItem('cartItem', JSON.stringify(getState().cart.cartItem));
};

export const removeFromCart = () => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM });

  localStorage.setItem('cartItem', JSON.stringify(getState().cart.cartItem));
};

