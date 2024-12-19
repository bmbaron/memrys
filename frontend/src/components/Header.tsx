import { Button, Card, Flex, Group, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from '../Header.module.css';
const Header = () => {
  const current_user = localStorage.getItem('current_user');
  return (
    <Card shadow={'lg'} style={{ zIndex: 1 }} p={{ xs: 40, sm: 0 }} pt={{ xs: 20, sm: 0 }}>
      <header className={classes.header}>
        <Group justify={'space-between'} h={'100%'}>
          <Flex m={{ xs: 'auto', sm: 'auto', md: 'unset' }}>
            <Title order={3}>{'Welcome back'}&nbsp;</Title>
            <Title order={3} c={'#FF00A1'}>
              {current_user}
            </Title>
            <Title order={3}>{'!'}</Title>
          </Flex>
          <Group m={{ xs: 'auto', sm: 'auto', md: 'unset' }}>
            <Link to={'/auth?mode=login'}>
              <Button variant={'default'}>Log out</Button>
            </Link>
          </Group>
        </Group>
      </header>
    </Card>
  );
};

export default Header;
