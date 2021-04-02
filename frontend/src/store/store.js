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
  orderListMyReducer
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
  orderListMy: orderListMyReducer
});

// La initierea Redux store, se preiau informatiile din localStorage, daca exista
const userInfoFromStorage = localStorage.getItem('userInfo') 
  ? JSON.parse(localStorage.getItem('userInfo')) 
  : null;

const cartItemFromStorage = localStorage.getItem('cartItem') 
? JSON.parse(localStorage.getItem('cartItem')) 
: {};

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  cart: {
    cartItem: cartItemFromStorage
  }
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;