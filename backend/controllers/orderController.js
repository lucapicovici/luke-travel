import asyncHandler from 'express-async-handler';
import { orderModel as Order } from '../models/index.js';
import { getRoomOrdersDates, getDaysBookings } from '../utils/orderUtils.js';

/**
 * @description   Plaseaza o comanda
 * @route         POST /api/orders
 * @access        Private
 */
const addOrderItems = asyncHandler(async(req, res) => {
  // TODO: validate input
  const { 
    booking,
    shippingAddress,
    paymentMethod,
    taxPrice,
    totalPrice 
  } = req.body;

  if (!booking) {
    res.status(400);
    throw new Error('No booking found');
  } else {
    const order = new Order({
      user: req.user._id,
      booking,
      shippingAddress,
      paymentMethod,
      taxPrice,
      totalPrice
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
    'booking.hotel._id' : hotel,
    'booking.room._id' : roomId
  }).select('booking');
  
  // Numarul rezervarilor care se suprapun cu perioada aleasa
  const bookingsThatOverlap = await bookingsOverlapNumber(orders, checkIn, checkOut);

  // Numarul de camere disponibile in perioada aleasa
  const validRooms = availableRooms - bookingsThatOverlap;

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

/**
 * @description   Returneaza comanda dupa ID
 * @route         GET /api/orders/:id
 * @access        Private
 */
const getOrderById = asyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @description   Actualizeaza comanda ca fiind platita
 * @route         PUT /api/orders/:id/pay
 * @access        Private
 */
 const updateOrderToPaid = asyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

/**
 * @description   Returneaza zilele ocupate ale unei camere de hotel
 * @route         GET /api/orders/calendar/:hotel/:room?start=2021-04-01&end=2021-06-30
 * @access        Public
 */
const getRoomCalendarBookings_days = asyncHandler(async(req, res) => {
  const roomOrders = await getRoomOrdersDates(req.params.hotel, req.params.room, req.query.start, req.query.end);

  if (!roomOrders.success) {
    res.status(400);
    throw new Error(roomOrders.error);
  }

  const orders = roomOrders.data;
  const daysBookingsRequest = await getDaysBookings(orders);

  if (!daysBookingsRequest.success) {
    res.status(400);
    throw new Error(daysBookingsRequest.error);
  }

  const daysBookings = daysBookingsRequest.data;
  
  res.status(200).json(daysBookings);
});


export {
  addOrderItems,
  validateOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getRoomCalendarBookings_days
}