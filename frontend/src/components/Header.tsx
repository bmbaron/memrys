import { Box, Button, Group } from '@mantine/core';
import classes from '../Header.module.css';

const Header = () => {
  return (
    <Box>
      <header className={classes.header}>
        <Group justify='space-between' h='100%'>
          <Group h='100%' gap={0} visibleFrom='sm'>
            <a href='#' className={classes.link}>
              Home
            </a>
            <a href='#' className={classes.link}>
              Features
            </a>
          </Group>
          <Group m={{ xs: 'auto', sm: 'auto', md: 'unset' }}>
            <Button variant='default'>Log in</Button>
            <Button>Sign up</Button>
          </Group>
        </Group>
      </header>
    </Box>
  );
};

export default Header;
