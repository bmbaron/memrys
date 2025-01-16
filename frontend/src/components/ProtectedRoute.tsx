import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = () => {
  const isAuthenticated = false;
  return isAuthenticated ? <Outlet /> : <Navigate to={'/auth?mode=login'} />;
};

export default ProtectedRoute;