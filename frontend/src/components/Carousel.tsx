import { Carousel } from '@mantine/carousel';
import { Card, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import dayjs from 'dayjs';
import { monthNames } from '../utils/getMonth.ts';
import CalendarGrid from './CalendarGrid.tsx';
import myData from './test-data.json';
import {useEffect, useState} from "react";

export type MonthObject = {
  month: string;
  stats: {
    [key: string]: number;
  };
};
const MyCarousel = () => {
  const theme = useMantineTheme();
  const currentMonth = dayjs().month();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const monthData = myData.monthData;

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAPI();
    if (error) {
      console.log(error);
    }
  }, [])
  const fetchAPI = async() => {
    const url = "http://localhost:3000/tester";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
    } catch (e: unknown) {
      setError((e as Error).message);
    }
  }

  return (
    <Carousel
      slideSize={'100%'}
      height={'100vh'}
      slideGap={'sm'}
      controlsOffset={'xs'}
      controlSize={100}
      loop
      withControls={isMobile ? false : true}
      initialSlide={currentMonth}
    >
      {monthNames.map((month, index) => (
        <Carousel.Slide key={index}>
          <Card bg={theme.colors.months[index]} h={'100%'} px={140}>
            <CalendarGrid
              monthNumber={index}
              stats={monthData.find((obj: MonthObject) => obj.month === month)}
            />
          </Card>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default MyCarousel;
