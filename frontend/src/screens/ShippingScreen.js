import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder } from '../store/actions/orderActions';

const ShippingScreen = () => {
  const dispatch = useDispatch();
  
  const cart = useSelector(state => state.cart);
  const { cartItem } = cart;

  return (
    <div>
      <p onClick={() => dispatch({ type: 'CART_REMOVE_ITEM' })}>Dispatch remove cart item</p>
      <button 
        onClick={() => dispatch(createOrder({
          booking: cartItem
        }))}
      >
        Save Order
      </button>
    </div>
  )
}

export default ShippingScreen
