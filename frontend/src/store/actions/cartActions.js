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

  localStorage.setItem('cartItem', JSON.stringify(getState().cart.cartItem));
};

export const removeFromCart = () => (dispatch, getState) => {
  dispatch({ type: CART_REMOVE_ITEM });

  localStorage.setItem('cartItem', JSON.stringify(getState().cart.cartItem));
};

