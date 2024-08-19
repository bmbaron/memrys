import { AppShell, createTheme, MantineProvider } from '@mantine/core';
import { Outlet } from 'react-router-dom';
const MainLayout = () => {
  const theme = createTheme({
    primaryColor: 'red',
    white: 'white',
    black: 'black',
    fontFamily: 'Roboto, sans-serif'
  });
  return (
    <MantineProvider theme={theme}>
      <AppShell padding="md">
        <Outlet />
      </AppShell>
    </MantineProvider>
  );
};

export default MainLayout;
