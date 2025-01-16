import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import MainLayout from './MainLayout.tsx';
import Authentication from './pages/Authentication.tsx';
import Home from './pages/Home';
import { UserContext } from './utils/UserContext.tsx';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Authentication />
      },
      {
        path: 'auth',
        element: <Authentication />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'home',
            element: <Home />
          }
        ]
      }
    ]
  }
]);

const App = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
};

export default App;
