import { hotelModel as Hotel } from '../models/index.js';

const getHotels = async(req, res, next) => {
  try {
    // Cauta toate hotelurile in baza de date
    const hotels = await Hotel.find({});
  
    res.status(200).json(hotels);
  } catch(err) {
    res.status(400);
    console.error(err);
  }
};

export {
  getHotels
}