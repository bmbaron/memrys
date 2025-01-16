import { Box } from '@mantine/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import MyCarousel from '../components/Carousel.tsx';
import Header from '../components/Header.tsx';
import { UserContext } from '../utils/UserContext.tsx';

const Home = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  if (!currentUser) navigate('/auth?mode=login');

  return (
    <Box w={'100vw'} h={'100vh'}>
      <Header />
      <MyCarousel />
    </Box>
  );
};

export default Home;
