import styled from '@emotion/styled';
import { Card, CardProps, createPolymorphicComponent, Paper } from '@mantine/core';
import dayjs from 'dayjs';

const getMonthDays = (index: number) => {
  const date = dayjs().month(index);
  return date.daysInMonth();
};
const CalendarBlock = (arg: { day: number }) => {
  return (
    <DayCard shadow="xs" p="xl" h={100} w={100} m={5}>
      {arg.day}
    </DayCard>
  );
};
const getDayCards = (numDays: number) => {
  const days = [];
  for (let i = 0; i < numDays; i++) {
    days.push(<CalendarBlock key={i} day={i + 1} />);
  }
  return days;
};
const CalendarGrid = (props: { month: number }) => {
  const monthDays = getMonthDays(props.month);
  return (
    <Paper
      w={700}
      m={'auto'}
      bg={'inherit'}
      component={'div'}
      h={'fit-content'}
      display={'flex'}
      style={{ flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {getDayCards(monthDays)}
    </Paper>
  );
};

export default CalendarGrid;

const _DayCard = styled(Card)`
  opacity: 0.85;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;
const DayCard = createPolymorphicComponent<'div', CardProps>(_DayCard);
