// TODO Change the font sizes on mobile so it doesn't scale the application when clicking into fields

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
import classes from '../Styles.module.css';
import { fetchMonthMemrys } from '../utils/getDataFromDB.ts';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
import { getMonthDays } from '../utils/getMonthInfo.ts';
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
  notes?: string;
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
      const data = await fetchMonthMemrys(`${dayjs().year()}-${monthNumber + 1}-01`);
      setMonthData(data);
    } catch (err: unknown) {
      navigate('/auth?mode=login');
      console.error((err as Error).message);
    }
  };

  const handleSearch = () => {
    if (monthData.length > 0) {
      setShowSearch(!showSearch);
      setFilterWord('');
    } else alert("This month doesn't have memories yet. \nClick on a date to add something.");
  };

  const getDayCards = (numDays: number, month: number) => {
    const monthTwoDigits = month < 9 ? `0${month + 1}` : `${month + 1}`;
    const days = [];
    for (let i = 1; i <= numDays; i++) {
      const dayData = monthData.find((obj) => dayjs(obj.created_at).date() === i);
      if (filterWord && dayData) {
        const filterArray = filterWord.toLowerCase().trim().split(' ');
        const hasMatches = new Array(filterArray.length).fill(false);
        filterArray.forEach((substr, index) => {
          if (
            dayData?.tag.toLowerCase().includes(substr) ||
            dayData?.location.toLowerCase().includes(substr) ||
            dayData?.title.toLowerCase().includes(substr)
          ) {
            hasMatches[index] = true;
          }
        });
        if (!hasMatches.includes(false)) {
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
      } else if (!filterWord) {
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
    <Paper w={{ base: 700, xs: '100vw', md: 700 }} m={'auto'} bg={'inherit'} mih={'fit-content'}>
      <Flex
        ta={'left'}
        mx={25}
        my={20}
        justify={'space-between'}
        align={'center'}
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 30, sm: 'unset' }}
      >
        <Title order={1} c={theme.black}>
          {month}
        </Title>
        <Flex
          gap={10}
          align={'center'}
          justify={'space-around'}
          bg={'#FF00A1'}
          h={55}
          style={{
            borderRadius: 50,
            transition: 'width 100ms linear',
            width: showSearch ? 400 : 180
          }}
          p={10}
        >
          <Badge color={'white'} size={'xl'}>
            <Flex>
              <Text c={theme.black} fw={700}>
                {dayCards ? dayCards.length : 0}&nbsp;
              </Text>
              <Text c={theme.black} tt={'lowercase'}>
                {dayCards?.length === 1 ? 'day' : 'days'}
              </Text>
            </Flex>
          </Badge>
          <Flex>
            <Transition
              mounted={showSearch}
              transition={'fade'}
              duration={1000}
              exitDuration={0}
              timingFunction={'ease'}
              keepMounted={false}
            >
              {(styles) => (
                <TextInput
                  style={styles}
                  classNames={classes}
                  autoFocus
                  value={filterWord}
                  w={210}
                  variant={'default'}
                  size={'md'}
                  placeholder={'title / name / location'}
                  onChange={(text) => setFilterWord(text.currentTarget.value)}
                />
              )}
            </Transition>
          </Flex>
          <FeatherIcon
            Type={showSearch ? X : Search}
            hasHover
            style={{ color: 'white' }}
            onClick={handleSearch}
          />
        </Flex>
      </Flex>
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
        m={'auto'}
        ta={'center'}
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
