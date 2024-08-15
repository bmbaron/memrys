import { Carousel } from '@mantine/carousel';

export function MyCarousel() {
  return (
      <Carousel slideSize="70%" height={200} slideGap="lg" controlsOffset="xs" controlSize={34} loop withIndicators>
        <Carousel.Slide>1</Carousel.Slide>
        <Carousel.Slide>2</Carousel.Slide>
        <Carousel.Slide>3</Carousel.Slide>
      </Carousel>
  );
}