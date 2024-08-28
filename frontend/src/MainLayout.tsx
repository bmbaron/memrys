import { AppShell, createTheme, Input, MantineProvider } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import classes from './Styles.module.css';
const MainLayout = () => {
  const theme = createTheme({
    primaryColor: 'red',
    white: 'white',
    black: 'black',
    colors: {
      months: [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'indigo',
        'violet',
        'purple',
        'pink',
        'maroon',
        'teal',
        'navy'
      ],
      stats: ['red', 'yellow', 'blue', '', '', '', '', '', '', '']
    },
    fontFamily: 'Roboto, sans-serif',
    breakpoints: {
      xs: '300px',
      sm: '600px',
      md: '800px',
      lg: '1000px',
      xl: '1440px'
    },
    components: {
      Input: Input.extend({ classNames: classes })
    }
  });
  return (
    <MantineProvider theme={theme}>
      <AppShell padding='md'>
        <Outlet />
      </AppShell>
    </MantineProvider>
  );
};

export default MainLayout;
