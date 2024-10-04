import { Box, Button, Flex, Group, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from '../Header.module.css';
import { getGradientColorText } from '../utils/gradientColorText.tsx';
const Header = () => {
  const current_user = localStorage.getItem('current_user');
  return (
    <Box>
      <header className={classes.header}>
        <Group justify={'space-between'} h={'100%'}>
          <Group h={'100%'} gap={0} visibleFrom={'sm'}>
            <a href={'#'} className={classes.link}>
              Home
            </a>
            <a href={'#'} className={classes.link}>
              Features
            </a>
          </Group>
          <Flex>
            <Title order={3}>{'Welcome back'}&nbsp;</Title>
            {getGradientColorText(current_user || "friend", 'orange', 'cyan', 3)}
            <Title order={3}>{'!'}</Title>
          </Flex>
          <Group m={{ xs: 'auto', sm: 'auto', md: 'unset' }}>
            <Link to={'/auth?mode=login'}>
              <Button variant={'default'}>Log in</Button>
            </Link>
            <Link to={'/auth?mode=register'}>
              <Button>Sign up</Button>
            </Link>
          </Group>
        </Group>
      </header>
    </Box>
  );
};

export default Header;
