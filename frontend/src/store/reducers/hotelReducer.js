import { 
  HOTEL_LIST_FAIL, 
  HOTEL_LIST_REQUEST, 
  HOTEL_LIST_SUCCESS 
} from "../constants/hotelConstants";

export const hotelListReducer = (state={ hotels: [] }, action) => {
  switch(action.type) {
    case HOTEL_LIST_REQUEST:
      return { loading: true, hotels: [] };
    case HOTEL_LIST_SUCCESS:
      return { 
        loading: false, 
        hotels: action.payload
      }; 
    case HOTEL_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};