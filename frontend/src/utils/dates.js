export const getCurrentDay = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export const getNextDay = (date) => {
  if (date) {
    date = new Date(date);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }
}

export const addDaysToDate = (date, days) => {
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export const getDaysRange = (start, end) => {
  start = new Date(start);
  end = new Date(end);
  let range = 0, currentDate = start;
  while (currentDate < end) {
    range += 1;
    currentDate = addDaysToDate(currentDate, 1);
  }
  return range;
}