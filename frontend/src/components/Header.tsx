import { Box, Button, Flex, Group, Title } from '@mantine/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import classes from '../Header.module.css';
import { UserContext } from '../utils/UserContext.tsx';
import { getGradientColorText } from '../utils/gradientColorText.tsx';
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
          <Flex>
            <Title order={3}>{'Welcome back'}&nbsp;</Title>
            {getGradientColorText(currentUser, 'orange', 'cyan', 3)}
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
