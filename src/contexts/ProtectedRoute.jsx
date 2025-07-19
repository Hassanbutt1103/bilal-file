import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const roleToPath = {
  admin: '/admin',
  Gerente: '/gerente',
  Finanaceiro: '/finanaceiro',
  Engenharia: '/engenharia',
  RH: '/rh',
  Comercial: '/comercial',
  Compras: '/compras',
};

const adminRoles = ['admin', 'manager', 'Gerente', 'Manager'];

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    requiredRole &&
    user?.role !== requiredRole &&
    !adminRoles.includes(user?.role)
  ) {
    // If user is logged in but not the right role, and not admin/manager, redirect to their dashboard
    const path = roleToPath[user?.role] || '/';
    return <Navigate to={path} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 