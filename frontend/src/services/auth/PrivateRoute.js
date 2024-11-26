// PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import TokenService from './tokenService';

const PrivateRoute = ({ children }) => {
  // Verificar el accessToken en lugar de authToken
  const isAuthenticated = TokenService.getAccessToken() !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children ? children : <Outlet />;
};

export default PrivateRoute;
