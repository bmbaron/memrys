import { Carousel } from '@mantine/carousel';
import { Card, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import { monthNames } from '../utils/getMonth.ts';
import CalendarGrid from './CalendarGrid.tsx';
const MyCarousel = () => {
  const theme = useMantineTheme();
  const currentMonth = dayjs().month();
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <Carousel
      slideSize="100%"
      height={'100vh'}
      slideGap="sm"
      controlsOffset="xs"
      controlSize={100}
      loop
      withControls={isMobile ? false : true}
      initialSlide={currentMonth}
    >
      {monthNames.map((month, index) => (
        <Carousel.Slide key={index}>
          <Card bg={theme.colors.months[index]} h={'100%'} px={140}>
            <CalendarGrid monthNumber={index} monthName={month} />
          </Card>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
