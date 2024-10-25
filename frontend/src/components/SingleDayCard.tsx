import styled from '@emotion/styled';
import { Badge, Box, Card, CardProps, createPolymorphicComponent, Flex, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'react-feather';
import FeatherIcon from '../utils/getFeatherIcon.tsx';
import { getMonthName } from '../utils/getMonth.ts';
import { getSuffix } from '../utils/getSuffix.ts';
import { dayData, ModalDataType } from './MonthGrid.tsx';
const SingleDayCard = (data: {
  day: number;
  month: string;
  setModalData: React.Dispatch<React.SetStateAction<ModalDataType>>;
  open: () => void;
  dayData?: dayData;
  filtered: boolean;
}) => {
  const { day, month, setModalData, open, dayData, filtered } = data;
  const monthName = getMonthName(Number(month) - 1);
  dayjs.extend(localeData);
  let dayString = `${dayjs().year()}-${month}-${day}`;
  if (day < 10) {
    dayString = `${dayjs().year()}-${month}-0${day}`;
  }
  const isToday = dayString === dayjs().toISOString().slice(0, 10);
  // const hasData = myData.dateData.find((obj: DayObject) => obj.date === dayString);
  const [tag, setTag] = useState('');
  const [location, setLocation] = useState('');
  const [showTitle, setShowTitle] = useState(false);
  const dayName = dayjs.weekdays()[dayjs(dayString).day()];
  const isMobile = useMediaQuery('(max-width: 800px)');

  useEffect(() => {
    if (dayData) {
      setTag(dayData.tag);
      setLocation(dayData.location);
    }
  }, [dayData]);

  const handleClick = () => {
    setModalData({
      title: `${dayName}, ${monthName} ${day}${getSuffix(day)}`,
      date: dayString
    });
    open();
  };
  return (
    <DayCard
      shadow={'sm'}
      p={{ xs: 'sm', md: 0 }}
      h={{ base: 100, xs: 70, md: 100 }}
      w={{ base: 100, xs: 70, md: 100 }}
      m={5}
      ta={'center'}
      lh={{ xs: '40px', md: 'unset' }}
      is31st={isMobile ? false : day === 31 && !filtered}
      isToday={isToday}
      onClick={handleClick}
      onMouseOver={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
    >
      {showTitle && (
        <Card
          pos={'absolute'}
          h={{ base: 100, xs: 70, md: 100 }}
          w={{ base: 100, xs: 70, md: 100 }}
          p={10}
          m={'auto'}
          ta={'center'}
          display={'flex'}
          style={{ justifyContent: 'center' }}
          c={'#FF00A1'}
        >
          {dayData && dayData.title ? (
            <Text
              fz={14}
              fw={700}
              truncate={'end'}
              lineClamp={3}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {dayData.title}
            </Text>
          ) : (
            <Box h={100} pt={10}>
              <FeatherIcon Type={PlusCircle} height={50} style={{ width: 50 }} />
            </Box>
          )}
        </Card>
      )}
      <Flex
        direction={'column'}
        w={100}
        ta={'center'}
        justify={'space-evenly'}
        align={'center'}
        mt={20}
        h={'100%'}
        my={5}
        mx={'auto'}
      >
        <Box pos={'absolute'} top={0} right={5}>
          {day}
        </Box>
        {dayData && (
          <Badge bg={'blue'} c={'white'} h={20} maw={100} lh={'10px'} fw={600} size={'md'}>
            {tag}
          </Badge>
        )}
        {dayData && (
          <Text
            c={'black'}
            h={20}
            lh={'14px'}
            fw={600}
            maw={90}
            size={'sm'}
            truncate={'end'}
            style={{ wordBreak: 'break-word' }}
          >
            @{location}
          </Text>
        )}
      </Flex>
    </DayCard>
  );
};

export default SingleDayCard;

const _DayCard = styled(Card, {
  shouldForwardProp: (props) => props !== 'is31st' && props !== 'isToday'
})<{ is31st: boolean; isToday: boolean }>(({ is31st, isToday }) => ({
  flexBasis: is31st ? '100%' : 'auto',
  marginLeft: is31st ? '7.5px !important' : 'unset',
  marginRight: is31st ? '7.5px !important' : 'unset',
  background: isToday ? 'lightgreen' : 'auto',
  opacity: 0.85,
  '&:hover': {
    cursor: 'pointer',
    opacity: 1
  }
}));

type CustomCardProps = CardProps & { is31st: boolean; isToday: boolean };
const DayCard = createPolymorphicComponent<'div', CustomCardProps>(_DayCard);
