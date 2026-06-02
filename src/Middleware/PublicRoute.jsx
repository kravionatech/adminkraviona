import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenStore } from '../services/apiClient';

const PublicRoute = ({ children }) => {
  const token = tokenStore.getAccess();
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children ? children : <Outlet />;
};

export default PublicRoute;
