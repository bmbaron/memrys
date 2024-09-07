import styled from '@emotion/styled';
import { Badge, Card, CardProps, createPolymorphicComponent } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import React from 'react';
import { getMonthName } from '../utils/getMonth.ts';
import { getSuffix } from '../utils/getSuffix.ts';
import { ModalDataType } from './CalendarGrid.tsx';
import { DayObject } from './ModalContent.tsx';
import myData from './test-data.json';
const SingleDayCard = (data: {
  day: number;
  month: string;
  setModalData: React.Dispatch<React.SetStateAction<ModalDataType>>;
  open: () => void;
}) => {
  const { day, month, setModalData, open } = data;
  const monthName = getMonthName(Number(month) - 1);
  dayjs.extend(localeData);
  let dayString = `${dayjs().year()}-${month}-${day}`;
  if (day < 10) {
    dayString = `${dayjs().year()}-${month}-0${day}`;
  }
  const isToday = dayString === dayjs().toISOString().slice(0, 10);
  console.log(dayString, dayjs().toISOString().slice(0, 10));
  const hasData = myData.dateData.find((obj: DayObject) => obj.date === dayString);
  const dayName = dayjs.weekdays()[dayjs(dayString).day()];
  const isMobile = useMediaQuery('(max-width: 800px)');
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
      shadow={"sm"}
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
      {hasData && hasData.notes.length > 0 ? (
        <Badge pos={"absolute"} top={2} right={2} color={"blue"} size={"md"} circle>
          {hasData.notes.length}
        </Badge>
      ) : null}
      {hasData && hasData.tags.length > 0 ? (
        <Badge pos={"absolute"} top={2} right={24} color={"yellow"} size={"md"} circle>
          {hasData.tags.length}
        </Badge>
      ) : null}
      {hasData && hasData.images.length > 0 ? (
        <Badge pos={"absolute"} top={2} right={46} color={"red"} size={"md"} circle>
          {hasData.images.length}
        </Badge>
      ) : null}
      {day}
      {isToday && (
        <Badge
          color={"black"}
          display={'flex'}
          w={40}
          p={5}
          style={{ overflow: 'visible', textTransform: 'none', fontSize: 9 }}
        >
          today
        </Badge>
      )}
    </DayCard>
    // </HoverCard.Target>
    // <HoverCard.Dropdown w={'fit-content'}>
    //   <Text size="sm">
    //     {/*from the locale weekdays names, return the name of the current weekday*/}
    //     {dayName}
    //   </Text>
    // </HoverCard.Dropdown>
    // </HoverCard>
  );
};

export default SingleDayCard;

const _DayCard = styled(Card, {
  shouldForwardProp: (props) => props !== 'is31st' && props !== 'isToday'
})<{ is31st: boolean; isToday: boolean }>(({ is31st, isToday }) => ({
  flexBasis: is31st ? '100%' : 'auto',
  marginLeft: is31st ? '7.5px !important' : 'unset',
  marginRight: is31st ? '7.5px !important' : 'unset',
  background: isToday ? 'yellow' : 'auto',
  opacity: isToday ? 1 : 0.85,
  '&:hover': {
    cursor: 'pointer',
    opacity: 1
  }
}));

type CustomCardProps = CardProps & { is31st: boolean; isToday: boolean };
const DayCard = createPolymorphicComponent<'div', CustomCardProps>(_DayCard);
