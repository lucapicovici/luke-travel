import asyncHandler from 'express-async-handler';
import { orderModel as Order } from '../models/index.js';

/**
 * @description   Plaseaza o comanda
 * @route         POST /api/orders
 * @access        Private
 */
const addOrderItems = asyncHandler(async(req, res) => {
  // TODO: validate input
  const { booking } = req.body;

  if (!booking) {
    res.status(400);
    throw new Error('No booking found');
  } else {
    const order = new Order({
      user: req.user._id,
      booking
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

/**
 * @description   Verifica disponibilitatea unei camere
 * @route         GET /api/orders/validate
 * @access        Public
 */
const validateOrder = asyncHandler(async(req, res) => {
  let { checkIn, checkOut, hotel, roomId, availableRooms } = req.query;
  checkIn = new Date(checkIn);
  checkOut = new Date(checkOut);

  // Pentru hotelul afisat pe pagina
  // Cauta toate rezervarile camerei pentru care se va afla disponibilitatea in perioada aleasa
  const orders = await Order.find({
    'booking.hotel' : hotel,
    'booking.roomId' : roomId
  }).select('booking');
  
  // Numarul rezervarilor care se suprapun cu perioada aleasa
  const result = await bookingsOverlapNumber(orders, checkIn, checkOut);

  const validRooms = availableRooms - result;

  if (validRooms > 0) {
    res.status(200).json(validRooms);
  } else {
    res.status(400);
    throw new Error('Room not available');
  }
});

/**
 * @description 
 * Verifica daca rezervarea 1 (date1, date2) se suprapune cu rezervarea 2 (date3, date4)
 * @param {Date} date1 Valoare check-in din formular
 * @param {Date} date2 Valoare check-out din formular
 * @param {Date} date3 Check-in rezervare existenta din baza de date
 * @param {Date} date4 Check-out rezervare existenta din baza de date
 */
const bookingsOverlap = async(date1, date2, date3, date4) => {
  const X = new Date(date1);
  const Y = new Date(date2);
  const A = new Date(date3);
  const B = new Date(date4);

  // /**
  //  * Exemple de cazuri de suprapunere
  //  * 
  //  * Cazul 1
  //  * (X<A && X<B && Y>A && Y<B)
  //  * ----(X---[A---Y)-----B]---
  //  * 
  //  * Cazul 2
  //  * (X>A && X<B && Y>A && Y<B)
  //  * ---------[A-(X---Y)--B]---
  //  * 
  //  * Cazul 3
  //  * (X>A && X<B && Y>A && Y>B)
  //  * ---------[A--(X-----B]--Y)--
  //  */

  if (
    !(X<A && X<B && Y<=A && Y<B) &&
    !(X>A && X>=B && Y>A && Y>B)
  ) return true;
  else return false;
};

const bookingsOverlapNumber = async(bookings, date1, date2) => {
  const X = new Date(date1);
  const Y = new Date(date2);

  let sum = 0;
  for (const B of bookings) {
    const val = await bookingsOverlap(X, Y, B.booking.checkIn, B.booking.checkOut) 
    if (val) {
      sum += 1;
      console.log(`OVERLAP - (${B.booking.checkIn.toISOString().split('T')[0]}->${B.booking.checkOut.toISOString().split('T')[0]}) with (${X.toISOString().split('T')[0]}->${Y.toISOString().split('T')[0]})`);
    }
  }
  return sum;
};

/**
 * @description   Returneaza toate comenzile utilizatorului logat
 * @route         GET /api/orders/my-orders
 * @access        Private
 */
const getMyOrders = asyncHandler(async(req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});


export {
  addOrderItems,
  validateOrder,
  getMyOrders
}