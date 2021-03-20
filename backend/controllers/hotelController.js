import asyncHandler from 'express-async-handler';
import { hotelModel as Hotel } from '../models/index.js';

/**
 * @description   Returneaza toate hotelurile
 * @route         GET /api/hotels
 * @access        Public
 */
const getHotels = asyncHandler(async(req, res) => {
  // Cauta toate hotelurile in baza de date
  const hotels = await Hotel.find({});

  res.status(200).json(hotels);
});

/**
 * @description   Returneaza un hotel dupa ID
 * @route         GET /api/hotels/:id
 * @access        Public
 */
const getHotelById = asyncHandler(async(req, res) => {
  // TODO: check if valid objectId
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    res.status(200).json(hotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

export {
  getHotels,
  getHotelById
}