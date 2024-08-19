import { Carousel } from '@mantine/carousel';
import { Card, Title, useMantineTheme } from '@mantine/core';
import dayjs from 'dayjs';
import { monthNames } from '../utils/getMonth.ts';
import CalendarGrid from './CalendarGrid.tsx';
const MyCarousel = () => {
  const theme = useMantineTheme();
  const currentMonth = dayjs().month();

  return (
    <Carousel
      slideSize="100%"
      height={'100vh'}
      slideGap="sm"
      controlsOffset="xs"
      controlSize={100}
      loop
      withIndicators
      initialSlide={currentMonth}
    >
      {monthNames.map((month, index) => (
        <Carousel.Slide key={index}>
          <Card bg={'red'} h={'100%'} px={140} py={50}>
            <Title ta={'center'} order={1} c={theme.white}>
              {month}
            </Title>
            <CalendarGrid month={index} />
          </Card>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
