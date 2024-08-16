import { Paper } from '@mantine/core';

type CalendarBlockProps = {
  day: number;
};
const CalendarBlock = ({ day }: CalendarBlockProps) => {
  return (
    <Paper shadow="xs" p="xl" h={100} w={100} m={5}>
      {day}
    </Paper>
  );
};

const CalendarGrid = () => {
  const daysInMonth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  //Array.apply(null, Array(dayjs().daysInMonth())).map(() => {});
  return (
    <Paper
      w={700}
      m={'auto'}
      bg={'inherit'}
      component={'div'}
      bd={'1px solid black'}
      h={'fit-content'}
      display={'flex'}
      style={{ flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {daysInMonth.map((empty, index: number) => (
        <CalendarBlock key={index} day={index + 1} />
      ))}
    </Paper>
  );
};

export default CalendarGrid;
