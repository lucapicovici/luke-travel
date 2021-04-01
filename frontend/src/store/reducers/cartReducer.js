import { 
  CART_ADD_ITEM, 
  CART_REMOVE_ITEM, 
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_RESET
} from '../constants/cartConstants';

export const cartReducer = (
  state={ cartItem: {}, shippingAddress: {} }, 
  action
) => {
  switch(action.type) {
    case CART_ADD_ITEM:
      return { 
        ...state, 
        cartItem: action.payload
      }
    case CART_REMOVE_ITEM:
      return {
        ...state,
        cartItem: {}
      }
    case CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload
      }
    case CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload
      }
    case CART_RESET:
      return {
        cartItem: {},
        shippingAddress: {} 
      }
    default:
      return state;
  }
}