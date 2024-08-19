import styled from '@emotion/styled';
import {
  Card,
  CardProps,
  createPolymorphicComponent,
  Group,
  HoverCard,
  Modal,
  Paper,
  Text
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { useState } from 'react';
import { getMonth } from '../utils/getMonth.ts';

const getMonthDays = (index: number) => {
  const date = dayjs().month(index);
  return date.daysInMonth();
};
const CalendarGrid = (data: { month: number }) => {
  const monthDays = getMonthDays(data.month);
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState('');
  const CalendarBlock = (data: { day: number; month: number }) => {
    dayjs.extend(localeData);
    const dayName =
      dayjs.weekdays()[dayjs(`${dayjs().year()}-${data.month + 1}-${data.day}`).day()];
    let daySuffix = 'th';

    if (data.day % 10 === 1) {
      daySuffix = 'st';
    } else if (data.day % 10 === 2) {
      daySuffix = 'nd';
    } else if (data.day % 10 === 3) {
      daySuffix = 'rd';
    }
    const handleClick = () => {
      setModalContent(`${dayName}, ${getMonth(data.month)} ${data.day}${daySuffix}`);
      open();
    };
    return (
      <Group justify="center">
        <HoverCard width={280} shadow="md">
          <HoverCard.Target>
            <DayCard shadow="sm" p="xl" h={100} w={100} m={5} onClick={handleClick}>
              {data.day}
            </DayCard>
          </HoverCard.Target>
          <HoverCard.Dropdown w={'fit-content'}>
            <Text size="sm">
              {/*from the locale weekdays names, return the name of the current weekday*/}
              {dayName}
            </Text>
          </HoverCard.Dropdown>
        </HoverCard>
      </Group>
    );
  };
  const getDayCards = (numDays: number, month: number) => {
    const days = [];
    for (let i = 0; i < numDays; i++) {
      days.push(<CalendarBlock key={i} day={i + 1} month={month} />);
    }
    return days;
  };
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
      <Modal opened={opened} onClose={close} title={modalContent} centered>
        {'Daily activity...'}
      </Modal>
      {getDayCards(monthDays, data.month)}
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
