import '@mantine/carousel/styles.css';
import { Box, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import About from './pages/About';
import Authentication from './pages/Authentication.tsx';
import Home from './pages/Home';
const App = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const fetchHeader = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/`;
    try {
      const response = await fetch(url, { method: 'GET', credentials: 'include' });
      if (!response.ok) {
        console.log('checked in app.tsx');
        throw new Error(`Response status: ${response.status}`);
      }
      const data = await response;
      if (data.status === 200) {
        setTimeout(() => {
          setAuthorized(true);
        }, 1000);
      } else setAuthorized(false);
      return data;
    } catch (err: unknown) {
      console.error((err as Error).message);
      setAuthorized(false);
      throw err;
    }
  };

  useEffect(() => {
    void fetchHeader();
  }, []);

  if (authorized === null) {
    return (
      <Box w={'100vw'} h={'100vh'} ta={'center'} pt={'45vh'}>
        <Loader size={'lg'} color={'green'} />
      </Box>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<MainLayout />}>
          {authorized ? (
            <Route index element={<Home />} />
          ) : (
            <Route path={'/'} element={<Navigate to={'/auth'} replace />} />
          )}
          <Route path={'auth'} element={<Authentication />} />
          <Route path={'about'} element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
