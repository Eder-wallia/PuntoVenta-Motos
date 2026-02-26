import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * HOC para proteger rutas privadas
 * Verifica si existe token y si no, redirige a login
 */
export const withAuth = (WrappedComponent) => {
  const ProtectedComponent = (props) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} user={user} />;
  };

  ProtectedComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ProtectedComponent;
};

export default withAuth;
