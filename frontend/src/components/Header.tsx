import { Box, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from '../Header.module.css';
const Header = () => {
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
          <Group m={{ xs: 'auto', sm: 'auto', md: 'unset' }}>
            <Link to={'/auth?mode=login'}>
              <Button variant={"default"}>Log in</Button>
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
