import { Box } from '@mantine/core';
import MyCarousel from '../components/Carousel.tsx';
import Header from '../components/Header.tsx';

const Home = () => {
  return (
    <Box w={'100vw'} h={'100vh'}>
      <Header />
      <MyCarousel />
    </Box>
  );
};

export default Home;
