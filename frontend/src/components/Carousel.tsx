import { Carousel } from '@mantine/carousel';
import { Card, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';
import { monthNames } from '../utils/getMonth.ts';
import MonthGrid from './MonthGrid.tsx';

const MyCarousel = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentSlide, setCurrentSlide] = useState(dayjs().month());

  return (
    <Carousel
      slideSize={'100%'}
      height={'100vh'}
      slideGap={'sm'}
      controlsOffset={'xs'}
      controlSize={100}
      loop
      withControls={isMobile ? false : true}
      initialSlide={dayjs().month()}
      onSlideChange={(index: number) => setCurrentSlide(index)}
    >
      {monthNames.map((month, index) => (
        <Carousel.Slide key={index}>
          <Card bg={theme.colors.months[index]} h={'100%'} px={140}>
            <MonthGrid monthNumber={index} month={month} shouldLoad={currentSlide === index} />
          </Card>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
