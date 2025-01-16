import { Box, Loader } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const fetchHeader = async () => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/`;
    try {
      const response = await fetch(url, { method: 'GET', credentials: 'include' });
      const data = await response.json();
      if (data.status === 200) {
        setAuthorized(true);
      } else setAuthorized(false);
    } catch (err: unknown) {
      console.error((err as Error).message);
      setAuthorized(false);
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

  return authorized ? <Outlet /> : <Navigate to={'/auth?mode=login'} replace />;
};

export default ProtectedRoute;
