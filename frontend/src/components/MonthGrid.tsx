import { Badge, Container, Flex, Modal, Paper, Text, Title, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Search } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { fetchMonthMemrys } from '../utils/getDataFromDB.ts';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
import ModalContent from './ModalContent.tsx';
import SingleDayCard from './SingleDayCard.tsx';

export type ModalDataType = {
  title: string;
  date: string;
};

export type dayData = {
  created_at: string;
  location: string;
  tag: string;
  title: string;
};
const getMonthDays = (index: number) => {
  const date = dayjs().month(index);
  return date.daysInMonth();
};
const MonthGrid = (data: { monthNumber: number; month: string; shouldLoad: boolean }) => {
  const { monthNumber, month, shouldLoad } = data;
  const monthDays = getMonthDays(monthNumber);
  const [opened, { open, close }] = useDisclosure(false);
  const [modalData, setModalData] = useState<ModalDataType>({ title: '', date: '' });
  const [tagsTally, setTagsTally] = useState<number>(0);
  const theme = useMantineTheme();
  const [monthData, setMonthData] = useState<dayData[]>([]);
  const navigate = useNavigate();
  const fetchMonthData = async () => {
    try {
      const data = await fetchMonthMemrys(`2024-${monthNumber + 1}-01`);
      setMonthData(data);
      setTagsTally(data.length);
    } catch (err: unknown) {
      navigate('/auth?mode=login');
      console.error((err as Error).message);
    }
  };

  useEffect(() => {
    if (shouldLoad) {
      void fetchMonthData();
    }
  }, [shouldLoad]);

  const getDayCards = (numDays: number, month: number) => {
    const monthTwoDigits = month < 9 ? `0${month + 1}` : `${month + 1}`;
    const days = [];
    for (let i = 1; i <= numDays; i++) {
      const dayData = monthData.find((obj) => dayjs(obj.created_at).date() === i);
      days.push(
        <SingleDayCard
          key={i}
          day={i}
          month={monthTwoDigits}
          setModalData={setModalData}
          open={open}
          dayData={dayData}
        />
      );
    }
    return days;
  };

  if (!data.shouldLoad) {
    return;
  }

  return (
    <Paper w={{ base: 700, xs: '100vw', md: 700 }} m={'auto'} bg={'inherit'} h={'100%'}>
      <Flex ta={'left'} mx={25} my={20} justify={'space-between'} align={'center'}>
        <Title order={1} c={theme.white}>
          {month}
        </Title>
        <Flex
          gap={10}
          align={'center'}
          bg={'rgba(255, 255, 255, 0.85)'}
          style={{ borderRadius: 50 }}
          p={10}
        >
          <Badge color={theme.white} size={'xl'}>
            <Flex>
              <Text c={theme.black}>{'tags'}</Text>
              <Text c={theme.black} tt={'none'}>
                &nbsp;{tagsTally}
              </Text>
            </Flex>
          </Badge>
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
        px={0}
        style={{ '--modal-y-offset': '50px' }}
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
            <ModalContent dateUTC={modalData.date} onClose={close} onReload={fetchMonthData} />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </Paper>
  );
};

export default MonthGrid;
