import styled from '@emotion/styled';
import {
  Card,
  CardProps,
  Container,
  createPolymorphicComponent,
  HoverCard,
  Modal,
  Paper,
  Text,
  Title,
  useMantineTheme
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
const CalendarGrid = (data: { monthNumber: number; monthName: string }) => {
  const monthDays = getMonthDays(data.monthNumber);
  const [opened, { open, close }] = useDisclosure(false);
  const [modalContent, setModalContent] = useState('');
  const theme = useMantineTheme();
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
      <HoverCard width={280} shadow="md" zIndex={0}>
        <HoverCard.Target>
          <DayCard
            shadow="sm"
            p="xl"
            h={100}
            w={100}
            m={5}
            is31st={data.day === 31}
            onClick={handleClick}
          >
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
    <Paper w={700} m={'auto'} bg={'inherit'} h={'100%'}>
      <Title ta={'left'} ml={25} order={1} c={theme.white} mb={20}>
        {data.monthName}
      </Title>
      <Container
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {getDayCards(monthDays, data.monthNumber)}
      </Container>
      <Modal opened={opened} onClose={close} title={modalContent} centered>
        {'Daily activity...'}
      </Modal>
    </Paper>
  );
};

export default CalendarGrid;

const _DayCard = styled(Card)<{ is31st: boolean }>`
  flex-basis: ${(props) => (props.is31st ? '100%' : 'auto')};
  margin-left: ${(props) => (props.is31st ? '7.5px !important' : 'unset')};
  margin-right: ${(props) => (props.is31st ? '7.5px !important' : 'unset')};
  opacity: 0.85;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

type CustomCardProps = CardProps & { is31st: boolean };
const DayCard = createPolymorphicComponent<'div', CustomCardProps>(_DayCard);
