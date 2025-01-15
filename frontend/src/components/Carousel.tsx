import { Carousel } from '@mantine/carousel';
import { Card } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';
import { monthNames } from '../utils/getMonthInfo.ts';
import MonthGrid from './MonthGrid.tsx';

const MyCarousel = () => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [currentSlide, setCurrentSlide] = useState(dayjs().month());

  return (
    <Carousel
      slideSize={'100%'}
      mih={'100vh'}
      slideGap={'sm'}
      controlsOffset={'xs'}
      controlSize={isMobile ? 50 : 100}
      loop
      withControls
      initialSlide={dayjs().month()}
      onSlideChange={(index: number) => setCurrentSlide(index)}
      withKeyboardEvents={false}
    >
      {monthNames.map((month, index) => (
        <Carousel.Slide key={index}>
          <Card bg={'white'} h={'100%'} px={{ xs: 'unset', sm: 140 }}>
            <MonthGrid monthNumber={index} month={month} shouldLoad={currentSlide === index} />
          </Card>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
