import cloneDeep from 'lodash/cloneDeep.js';
import { orderModel as Order } from '../models/index.js';

export const getRoomOrdersDates = async(hotel, room, start, end) => {
  try {
    const query = {};

    if (hotel) query['booking.hotel._id'] = hotel;
    if (room) query['booking.room._id'] = room;
    if (start) {
      query['booking.checkIn'] = { $gte: new Date(start).toISOString() }
    }
    if (end) {
      query['booking.checkOut'] = { $lt: new Date(end).toISOString() }
    }
    query.isPaid = true;

    const orders = await Order.find(query).select('booking.checkIn booking.checkOut');

    const results = orders.map(order => ({
      checkIn: order.booking.checkIn,
      checkOut: order.booking.checkOut
    }));

    return {
      success: true,
      data: results
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

export const getDaysBookings = async(dataCalendar) => {
  try {
    let daysBookings = [];
    let currentDate;
  
    for (const booking of dataCalendar) {
      currentDate = new Date(booking.checkIn);
      let end = new Date(booking.checkOut);
      
      for (let d = currentDate; d < end; d.setDate(d.getDate() + 1)) {
        const aux = cloneDeep(d);
  
        let exists = await findObject(daysBookings, d);
    
        if (exists >= 0) {
          daysBookings[exists].bookings += 1;
        } else {
          daysBookings.push({
            date: aux,
            bookings: 1
          });
        }
      }
    }
    return {
      success: true,
      data: daysBookings
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// try findIndex alternative
const findObject = async(daysBookings, date) => {
  for (let i = 0; i < daysBookings.length; i++) {
    if (daysBookings[i].date && daysBookings[i].date.toISOString() === date.toISOString()) {
      return i;
    }
  }
  return -1;
}