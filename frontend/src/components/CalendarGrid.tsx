import { Container, FocusTrap, Modal, Paper, Title, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';
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
const CalendarGrid = (data: { monthNumber: number; monthName: string }) => {
  const { monthNumber, monthName } = data;
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
      <Title ta={'left'} ml={25} order={1} c={theme.white} mb={20}>
        {monthName}
      </Title>
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
        className="mantine-focus-never"
      >
        <FocusTrap.InitialFocus />
        <ModalContent data={modalData.date} />
      </Modal>
    </Paper>
  );
};

export default CalendarGrid;
