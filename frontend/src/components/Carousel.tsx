import { Carousel } from '@mantine/carousel';
import { Card, Title } from '@mantine/core';
import { monthNames } from '../utils/getMonth.ts';
import CalendarGrid from './CalendarGrid.tsx';
const MyCarousel = () => {
  return (
    <Carousel
      slideSize="100%"
      height={'100vh'}
      slideGap="sm"
      controlsOffset="xs"
      controlSize={100}
      loop
      withIndicators
      initialSlide={2}
    >
      {monthNames.map((month, index) => (
        <Carousel.Slide key={index}>
          <Card bg={'red'} h={'100%'} px={140} py={50}>
            <Title ta={'center'} order={1}>
              {month}
            </Title>
            <CalendarGrid />
          </Card>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
