import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = ({ children }) => {

  const isAuthenticated = true; 

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

 
  return children ? children : <Outlet />;
};

export default PublicRoute;