import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const useRegisterClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = useAuthStore((state) => state.token);

  const registerClient = async (clientData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        nombre: clientData.nombre,
        email: clientData.email,
        telefono: clientData.telefono,
        domicilio: clientData.domicilio,
      };

      console.log('Enviando datos del cliente:', payload);
      console.log('Token:', token ? 'Presente' : 'Ausente');

      const response = await axios.post('http://localhost:3000/api/clientes', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      console.log('Cliente registrado exitosamente:', data);

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.error('Error al registrar cliente:', err);
      console.error('Status:', err.response?.status);
      console.error('Error Response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar cliente';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getAllClients = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Obteniendo todos los clientes...');
      console.log('Token:', token ? 'Presente' : 'Ausente');

      const response = await axios.get('http://localhost:3000/api/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      console.log('Clientes obtenidos exitosamente:', data);
      console.log('Total de clientes:', data.total);
      console.log('Lista de clientes:', data.clientes);

      return {
        success: true,
        data: data.clientes || [],
        total: data.total || 0,
      };
    } catch (err) {
      console.error('Error al obtener clientes:', err);
      console.error('Status:', err.response?.status);
      console.error('Error Response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener clientes';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
        data: [],
        total: 0,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerClient,
    getAllClients,
    isLoading,
    error,
  };
};
