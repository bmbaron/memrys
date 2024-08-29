import '@mantine/carousel/styles.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainLayout from './MainLayout';
import About from './pages/About';
import Authentication from './pages/Authentication.tsx';
import Home from './pages/Home';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path={'/'} element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path={'auth'} element={<Authentication />} />
          <Route path={'about'} element={<About />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
