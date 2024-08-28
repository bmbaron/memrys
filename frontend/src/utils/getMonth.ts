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
  return monthNames[index];
};

export const getMonthNumber = (name: string) => {
  return monthNames.indexOf(name);
};
