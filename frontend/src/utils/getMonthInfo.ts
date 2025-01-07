import dayjs from "dayjs";

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
export const getMonthName = (index: number) => {
  if (index < 0 || index > 11) {
    throw new Error('Invalid month index');
  }
  return monthNames[index];
};

export const getMonthDays = (index: number) => {
  if (index < 0 || index > 11) {
    throw new Error('Invalid month index');
  }
  const date = dayjs().month(index);
  return date.daysInMonth();
};

