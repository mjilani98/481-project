import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate home page based on role
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/home'} replace />;
  }

  return children;
}

export default ProtectedRoute;
