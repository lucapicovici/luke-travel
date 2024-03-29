import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { 
  hotelDeleteReducer,
  hotelDetailsReducer, 
  hotelListReducer, 
  hotelReviewCreateReducer, 
  hotelReviewDeleteReducer, 
  hotelUpdateReducer,
  searchCriteriaReducer
} from './reducers/hotelReducer';
import { 
  userDeleteReducer,
  userDetailsReducer, 
  userListReducer, 
  userLoginReducer,
  userRegisterReducer, 
  userUpdateProfileReducer,
  userUpdateReducer
} from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';
import {
  orderCreateReducer,
  orderValidateReducer,
  orderListMyReducer,
  orderDetailsReducer,
  orderPayReducer,
  orderCalendarReducer,
  orderListReducer,
  orderDeliverReducer
} from './reducers/orderReducer';

const reducer = combineReducers({
  hotelList: hotelListReducer,
  hotelDetails: hotelDetailsReducer,
  hotelDelete: hotelDeleteReducer,
  hotelUpdate: hotelUpdateReducer,
  hotelReviewCreate: hotelReviewCreateReducer,
  hotelReviewDelete: hotelReviewDeleteReducer,
  searchCriteria: searchCriteriaReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderValidate: orderValidateReducer,
  orderListMy: orderListMyReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderCalendar: orderCalendarReducer,
  orderList: orderListReducer,
  orderDeliver: orderDeliverReducer
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

const searchCriteriaFromStorage = localStorage.getItem('searchCriteria')
  ? JSON.parse(localStorage.getItem('searchCriteria'))
  : {};

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  cart: {
    booking: bookingFromStorage,
    shippingAddress: shippingAddressFromStorage
  },
  searchCriteria: searchCriteriaFromStorage
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;