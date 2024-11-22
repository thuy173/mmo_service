import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/Store';

interface ProtectedRouteProps {
  redirectPath?: string;
  isLoginRoute?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  redirectPath = '/auth/login',
  isLoginRoute = false,
}) => {
  const isAuthenticated = useSelector((state: RootState) => {
    const loggedIn = state.loginReducer.isLoggedIn;
    
return loggedIn || localStorage.getItem('isLoggedIn') === 'true';
  });

  if (isLoginRoute && isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isLoginRoute && !isAuthenticated) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
