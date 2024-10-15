import {
  Badge,
  Container,
  Flex,
  Modal,
  Paper,
  Text,
  TextInput,
  Title,
  Transition,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { ReactElement, useEffect, useState } from 'react';
import { Search, X } from 'react-feather';
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
  const [dayCards, setDayCards] = useState<ReactElement[] | undefined>(undefined);
  const theme = useMantineTheme();
  const [monthData, setMonthData] = useState<dayData[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [filterWord, setFilterWord] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const fetchMonthData = async () => {
    try {
      const data = await fetchMonthMemrys(`2024-${monthNumber + 1}-01`);
      setMonthData(data);
    } catch (err: unknown) {
      navigate('/auth?mode=login');
      console.error((err as Error).message);
    }
  };

  const getDayCards = (numDays: number, month: number) => {
    const monthTwoDigits = month < 9 ? `0${month + 1}` : `${month + 1}`;
    const days = [];
    for (let i = 1; i <= numDays; i++) {
      const dayData = monthData.find((obj) => dayjs(obj.created_at).date() === i);
      if (filterWord && dayData) {
        const hasTag = dayData?.tag.toLowerCase().includes(filterWord.toLowerCase());
        const hasLocation = dayData?.location.toLowerCase().includes(filterWord.toLowerCase());
        if (hasTag || hasLocation) {
          days.push(
            <SingleDayCard
              key={i}
              day={i}
              month={monthTwoDigits}
              setModalData={setModalData}
              open={open}
              dayData={dayData}
              filtering={filterWord}
            />
          );
        }
      } else if (filterWord === '') {
        days.push(
          <SingleDayCard
            key={i}
            day={i}
            month={monthTwoDigits}
            setModalData={setModalData}
            open={open}
            dayData={dayData}
            filtering={filterWord}
          />
        );
      }
    }
    return days;
  };

  useEffect(() => {
    if (shouldLoad) {
      void fetchMonthData();
    }
    return () => {
      setFilterWord('');
      setShowSearch(false);
    };
  }, [shouldLoad]);

  useEffect(() => {
    const cards = getDayCards(monthDays, monthNumber);
    setDayCards(cards);
  }, [monthData, filterWord]);

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
          justify={'space-around'}
          bg={'rgba(255, 255, 255, 0.85)'}
          h={55}
          style={{
            borderRadius: 50,
            transition: 'width 100ms linear',
            width: showSearch ? 400 : 170
          }}
          p={10}
        >
          <Badge color={theme.white} size={'xl'}>
            <Flex>
              <Text c={theme.black}>{dayCards ? dayCards.length : 0}&nbsp;</Text>
              <Text c={theme.black} tt={'lowercase'}>
                {'days'}
              </Text>
            </Flex>
          </Badge>
          <Flex>
            <Transition
              mounted={showSearch}
              transition={'fade'}
              duration={600}
              enterDelay={100}
              exitDuration={20}
              timingFunction={'ease'}
            >
              {(styles) => (
                <TextInput
                  style={styles}
                  autoFocus
                  value={filterWord}
                  w={200}
                  variant={'filled'}
                  placeholder={'filter by person or location'}
                  onChange={(text) => setFilterWord(text.currentTarget.value)}
                />
              )}
            </Transition>
          </Flex>
          <FeatherIcon
            Type={showSearch ? X : Search}
            hasHover
            onClick={() => {
              setShowSearch(!showSearch);
              setFilterWord('');
            }}
          />
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
        {dayCards}
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
            {/*<Modal.CloseButton />*/}
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
