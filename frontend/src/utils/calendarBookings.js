import cloneDeep from 'lodash/cloneDeep';

const getCalendarBookings = async(dataCalendar, daysBookings) => {
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
  console.log(daysBookings)
}

const findObject = async(daysBookings, date) => {
  for (let i = 0; i < daysBookings.length; i++) {
    if (daysBookings[i].date?.toISOString() === date.toISOString()) {
      return i;
    }
  }
  return -1;
}

export default getCalendarBookings;