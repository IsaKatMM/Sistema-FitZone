// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si requiere ser administrador
  if (requireAdmin && currentUser?.rol !== 'ADMINISTRADOR') {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;