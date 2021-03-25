import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { hotelDetailsReducer, hotelListReducer } from './reducers/hotelReducer';

const reducer = combineReducers({
  hotelList: hotelListReducer,
  hotelDetails: hotelDetailsReducer
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;