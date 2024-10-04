import { Box, Button, Group, Title } from '@mantine/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import classes from '../Header.module.css';
import { UserContext } from '../utils/UserContext.tsx';
const Header = () => {
  const { currentUser } = useContext(UserContext);
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
          <Title order={3}>{`Welcome back ${currentUser}`}</Title>
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
