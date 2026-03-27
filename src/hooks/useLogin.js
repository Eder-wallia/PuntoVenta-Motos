import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://puntoventa-back.onrender.com/api/auth/login', {
        email,
        password,
      });

      const data = response.data;

      // Transformar datos del usuario para que coincidan con el store
      const userData = {
        _id: data.usuario.id,
        email: data.usuario.email,
        name: data.usuario.nombre,
        role: data.usuario.rol,
      };

      // Guardar token y usuario en el store
      setToken(data.token);
      setUser(userData);
      console.log('Login exitoso:', data);

      return {
        success: true,
        data,
      };
    } catch (err) {
      setError(err.message);
      return {
        success: false,
        error: err.message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
};
