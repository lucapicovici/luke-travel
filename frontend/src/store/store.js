import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { 
  hotelDetailsReducer, 
  hotelListReducer 
} from './reducers/hotelReducer';
import { 
  userDetailsReducer, 
  userLoginReducer,
  userRegisterReducer, 
  userUpdateProfileReducer
} from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import {
  orderCreateReducer,
  orderValidateReducer,
  orderListMyReducer,
  orderDetailsReducer,
  orderPayReducer
} from './reducers/orderReducer';

const reducer = combineReducers({
  hotelList: hotelListReducer,
  hotelDetails: hotelDetailsReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderValidate: orderValidateReducer,
  orderListMy: orderListMyReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer
});

// La initierea Redux store, se preiau informatiile din localStorage, daca exista
const userInfoFromStorage = localStorage.getItem('userInfo') 
  ? JSON.parse(localStorage.getItem('userInfo')) 
  : null;

const bookingFromStorage = localStorage.getItem('booking') 
? JSON.parse(localStorage.getItem('booking')) 
: {};

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') 
  ? JSON.parse(localStorage.getItem('shippingAddress')) 
  : {};

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  cart: {
    booking: bookingFromStorage,
    shippingAddress: shippingAddressFromStorage
  }
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;