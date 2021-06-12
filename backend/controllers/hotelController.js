import asyncHandler from 'express-async-handler';
import { hotelModel as Hotel } from '../models/index.js';

/**
 * @description   Returneaza toate hotelurile
 * @route         GET /api/hotels
 * @access        Public
 */
const getHotels = asyncHandler(async(req, res) => {
  // Numar maxim de elemente pe pagina
  const pageSize = 3;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Hotel.countDocuments();

  // Cauta toate hotelurile in baza de date
  const hotels = await Hotel.find({})
    .limit(pageSize)
    .skip(pageSize * (page-1));

  res.status(200).json({
    hotels,
    page,
    pages: Math.ceil(count / pageSize)
  });
});

/**
 * @description   Returneaza un hotel dupa ID
 * @route         GET /api/hotels/:id
 * @access        Public
 */
const getHotelById = asyncHandler(async(req, res) => {
  // TODO-01: check if valid objectId
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    res.status(200).json(hotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

/**
 * @description   Sterge un hotel
 * @route         DELETE /api/hotels/:id
 * @access        Private/Admin
 */
const deleteHotel = asyncHandler(async(req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    await hotel.deleteOne();
    res.status(200).json({ message: 'Hotel removed' });
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

/**
 * @desc    Actualizeaza un hotel
 * @route   PUT /api/hotels/:id
 * @access  Private/Admin
 */
const updateHotel = asyncHandler(async(req, res) => {
  const { 
    name, 
    type, 
    address,
    images,
    roomTypes 
  } = req.body;
  
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    hotel.name = name;
    hotel.type = type;
    hotel.address = address;
    hotel.images = images;
    hotel.roomTypes = roomTypes;

    const updatedHotel = await hotel.save();
    res.status(201).json(updatedHotel);
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

export {
  getHotels,
  getHotelById,
  deleteHotel,
  updateHotel
}