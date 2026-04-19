import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, role, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Or a 403 Forbidden page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
