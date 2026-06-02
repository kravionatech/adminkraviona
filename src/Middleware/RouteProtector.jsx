import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RouteProtector = ({ children }) => {
  // Placeholder for actual authentication logic (e.g., from Redux, Context, or a token check)
  const isAuthenticated = true; 

  // 1. Guard Clause: If NOT authenticated, immediately redirect.
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // 2. Success: If authenticated, render the children.
  // We use <Outlet /> as a fallback so this component can also be used to wrap nested routes in your App.js
  return children ? children : <Outlet />;
};

export default RouteProtector;