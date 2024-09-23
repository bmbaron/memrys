import styled from '@emotion/styled';
import { Badge, Box, Card, CardProps, createPolymorphicComponent } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import React, { useEffect, useState } from 'react';
import { getMonthName } from '../utils/getMonth.ts';
import { getSuffix } from '../utils/getSuffix.ts';
import { dayData, ModalDataType } from './MonthGrid.tsx';
const SingleDayCard = (data: {
  day: number;
  month: string;
  setModalData: React.Dispatch<React.SetStateAction<ModalDataType>>;
  open: () => void;
  dayData?: dayData;
}) => {
  const { day, month, setModalData, open, dayData } = data;
  const monthName = getMonthName(Number(month) - 1);
  dayjs.extend(localeData);
  let dayString = `${dayjs().year()}-${month}-${day}`;
  if (day < 10) {
    dayString = `${dayjs().year()}-${month}-0${day}`;
  }
  const isToday = dayString === dayjs().toISOString().slice(0, 10);
  // const hasData = myData.dateData.find((obj: DayObject) => obj.date === dayString);
  const [tag, setTag] = useState('');
  const dayName = dayjs.weekdays()[dayjs(dayString).day()];
  const isMobile = useMediaQuery('(max-width: 800px)');

  useEffect(() => {
    if (dayData) {
      setTag(dayData.tag);
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
    // <HoverCard width={280} shadow="md" zIndex={0}>
    //   <HoverCard.Target>
    <DayCard
      shadow={'sm'}
      p={{ xs: 'sm', md: 'xl' }}
      h={{ base: 100, xs: 70, md: 100 }}
      w={{ base: 100, xs: 70, md: 100 }}
      m={5}
      ta={'center'}
      lh={{ xs: '40px', md: '40px' }}
      is31st={isMobile ? false : day === 31}
      isToday={isToday}
      onClick={handleClick}
    >
      {/*{hasData && hasData.notes.length > 0 ? (*/}
      {/*  <Badge pos={'absolute'} top={2} right={2} color={'blue'} size={'md'} circle>*/}
      {/*    {hasData.notes.length}*/}
      {/*  </Badge>*/}
      {/*) : null}*/}
      {tag ? (
        <Box pos={'absolute'} top={-5} left={0} w={100} ta={'center'}>
          <Badge bg={'blue'} c={'white'} h={20} maw={60} lh={'25px'} fw={600} size={'xs'}>
            {tag}
          </Badge>
        </Box>
      ) : null}
      {/*{hasData && hasData.images.length > 0 ? (*/}
      {/*  <Badge pos={'absolute'} top={2} right={46} color={'red'} size={'md'} circle>*/}
      {/*    {hasData.images.length}*/}
      {/*  </Badge>*/}
      {/*) : null}*/}
      {day}
      {isToday && (
        <Badge
          c={'rgb(255, 255, 0)'}
          fz={12}
          bg={'black'}
          display={'flex'}
          w={60}
          p={10}
          ml={-10}
          style={{ overflow: 'visible', textTransform: 'none' }}
        >
          today
        </Badge>
      )}
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
  opacity: isToday ? 1 : 0.85,
  '&:hover': {
    cursor: 'pointer',
    opacity: 1
  }
}));

type CustomCardProps = CardProps & { is31st: boolean; isToday: boolean };
const DayCard = createPolymorphicComponent<'div', CustomCardProps>(_DayCard);
