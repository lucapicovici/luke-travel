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

  // Filtrare in functie de tip
  const reqQuery = { ...req.query };
  const removeFields = ['pageNumber'];

  removeFields.forEach(param => delete reqQuery[param]);
  
  const count = await Hotel.countDocuments(reqQuery);

  // Cauta toate hotelurile in baza de date
  const hotels = await Hotel.find(reqQuery)
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

/**
 * @desc    Adauga o recenzie
 * @route   POST /api/hotels/:id/reviews
 * @access  Private
 */
const createHotelReview = asyncHandler(async(req, res) => {
  const { rating, comment } = req.body;
  
  const hotel = await Hotel.findById(req.params.id);

  if (hotel) {
    // Verifica daca utilizatorul logat a adaugat deja o recenzie
    const alreadyReviewed = hotel.reviews.find(review => review.user.toString() === req.user._id.toString());

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Hotel already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    hotel.reviews.push(review);
    hotel.numReviews = hotel.reviews.length;

    // Calcularea mediei aritmetice a recenziilor
    hotel.rating = hotel.reviews.reduce((acc, item) => item.rating + acc, 0)
      / hotel.reviews.length;

    await hotel.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Hotel not found');
  }
});

/**
 * @desc    Sterge o recenzie
 * @route   DELETE /api/hotels/:id/reviews/:reviewId
 * @access  Private
 */
const deleteHotelReview = asyncHandler(async(req, res) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    res.status(404);
    throw new Error('Hotel not found');
  }

  const reviews = hotel.reviews.filter(rev => rev._id != req.params.reviewId);
  
  if (reviews.length === hotel.reviews.length) {
    res.status(404);
    throw new Error('Review not found');
  }
  
  hotel.reviews = reviews;
  await hotel.save();
  res.status(200).json({ message: 'Deleted review' });
});

export {
  getHotels,
  getHotelById,
  deleteHotel,
  updateHotel,
  createHotelReview,
  deleteHotelReview
}