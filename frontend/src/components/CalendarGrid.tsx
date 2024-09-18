import { Badge, Container, Flex, Modal, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Search } from 'react-feather';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
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
    const monthTwoDigits = month < 9 ? `0${month + 1}` : `${month + 1}`;
    const days = [];
    for (let i = 0; i < numDays; i++) {
      days.push(
        <SingleDayCard
          key={i}
          day={i + 1}
          month={monthTwoDigits}
          setModalData={setModalData}
          open={open}
          refresh={opened}
        />
      );
    }
    return days;
  };

  return (
    <Paper w={{ base: 700, xs: '100vw', md: 700 }} m={'auto'} bg={'inherit'} h={'100%'}>
      <Flex ta={'left'} mx={25} my={20} justify={'space-between'} align={'center'}>
        <Title order={1} c={theme.white}>
          {stats && stats.month}
        </Title>
        <Flex
          gap={10}
          align={'center'}
          bg={'rgba(255, 255, 255, 0.85)'}
          style={{ borderRadius: 50 }}
          p={10}
        >
          {stats &&
            stats.stats &&
            Object.keys(stats.stats).map((oneKey, index) => (
              <Badge color={theme.colors.stats[index]} size={'xl'} key={index}>
                <Flex>
                  <Text c={theme.white}>{stats.stats[oneKey]}</Text>
                  <Text tt={'none'}>&nbsp;{oneKey}</Text>
                </Flex>
              </Badge>
            ))}
          <FeatherIcon Type={Search} style={{ marginLeft: 20, marginRight: 10 }} hasHover />
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
      <Modal.Root
        opened={opened}
        onClose={close}
        centered
        className={'mantine-focus-never'}
        size={'xl'}
        px={20}
      >
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header m={'auto'} style={{ boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}>
            <Modal.Title>
              <Text size={'xl'} fw={500}>
                {modalData.title}
              </Text>
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <ModalContent dateUTC={modalData.date} onClose={close} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </Paper>
  );
};

export default CalendarGrid;
