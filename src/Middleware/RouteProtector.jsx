import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { tokenStore } from '../services/apiClient';

const RouteProtector = ({ children }) => {
  const location = useLocation();
  const token = tokenStore.getAccess();

  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default RouteProtector;
