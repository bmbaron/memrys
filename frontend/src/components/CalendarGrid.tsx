import {
  Badge,
  Container,
  Flex,
  FocusTrap,
  Modal,
  Paper,
  Text,
  Title,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';
import { MonthObject } from './Carousel.tsx';
import ModalContent from './ModalContent.tsx';
import SingleDayCard from './SingleDayCard.tsx';

export type ModalDataType = {
  title: string;
  date: string;
};
const getMonthDays = (index: number) => {
  const date = dayjs().month(index);
  return date.daysInMonth();
};
const CalendarGrid = (data: { monthNumber: number; stats?: MonthObject }) => {
  const { monthNumber, stats } = data;
  const monthDays = getMonthDays(monthNumber);
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<ModalDataType>({ title: '', date: '' });
  const theme = useMantineTheme();

  const getDayCards = (numDays: number, month: number) => {
    const monthTwoDigits = month < 10 ? `0${month + 1}` : `${month + 1}`;
    const days = [];
    for (let i = 0; i < numDays; i++) {
      days.push(
        <SingleDayCard
          key={i}
          day={i + 1}
          month={monthTwoDigits}
          setModalData={setModalData}
          open={open}
        />
      );
    }
    return days;
  };
  return (
    <Paper w={{ base: 700, xs: '100vw', md: 700 }} m={'auto'} bg={'inherit'} h={'100%'}>
      <Flex ta={'left'} ml={25} mb={20}>
        <Title order={1} c={theme.white}>
          {stats && stats.month}
        </Title>
        <Flex>
          {stats &&
            stats.stats &&
            Object.keys(stats.stats).map((oneKey, index) => (
              <Badge color='red' size='xl' key={index}>
                <Flex>
                  <Text c={theme.white}>{stats.stats[oneKey]}</Text>
                  <Text tt={'none'}>&nbsp;{oneKey}</Text>
                </Flex>
              </Badge>
            ))}
        </Flex>
      </Flex>
      <Container
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {getDayCards(monthDays, monthNumber)}
      </Container>
      <Modal
        opened={opened}
        onClose={close}
        title={modalData.title}
        centered
        className='mantine-focus-never'
      >
        <FocusTrap.InitialFocus />
        <ModalContent data={modalData.date} />
      </Modal>
    </Paper>
  );
};

export default CalendarGrid;
