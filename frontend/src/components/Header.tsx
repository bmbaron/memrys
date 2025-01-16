import { Button, Card, Flex, Group, Title } from '@mantine/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import classes from '../Header.module.css';
import { UserContext } from '../utils/UserContext.tsx';

const Header = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const handleLogout = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/logout`;
    try {
      const response = await fetch(url, { method: 'POST', credentials: 'include' });
      const data = await response.json();
      if (data.status === 200) {
        console.log('logged out');
      }
    } catch (err: unknown) {
      console.error((err as Error).message);
    } finally {
      setCurrentUser('');
    }
  };

  return (
    <Card shadow={'lg'} style={{ zIndex: 1 }} p={{ xs: 40, sm: 0 }} pt={{ xs: 20, sm: 0 }}>
      <header className={classes.header}>
        <Group justify={'space-between'} h={'100%'}>
          <Flex m={{ xs: 'auto', sm: 'auto', md: 'unset' }}>
            <Title order={3}>{'Welcome back'}&nbsp;</Title>
            <Title order={3} c={'#FF00A1'}>
              {currentUser}
            </Title>
            <Title order={3}>{'!'}</Title>
          </Flex>
          <Group m={{ xs: 'auto', sm: 'auto', md: 'unset' }} onClick={handleLogout}>
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
