import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const useHistoryVehicle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = useAuthStore((state) => state.token);

  const getWorkHistory = async (vehiculoId) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!vehiculoId) {
        throw new Error('vehiculoId es requerido');
      }

      console.log('🔄 Obteniendo historial de trabajos para vehiculoId:', vehiculoId);
      console.log('Token:', token ? 'Presente' : 'Ausente');

      const response = await axios.get(
        `http://localhost:3000/api/trabajos/vehiculo/${vehiculoId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = response.data;

      console.log('✅ Historial de trabajos obtenido exitosamente:', data);
      console.log('Total de trabajos:', data.total);
      console.log('Lista de trabajos:', data.trabajos);

      return {
        success: true,
        data: data.trabajos || [],
        total: data.total || 0,
      };
    } catch (err) {
      console.error('❌ Error al obtener historial de trabajos:', err);
      console.error('Status:', err.response?.status);
      console.error('Error Response:', err.response?.data);

      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener historial de trabajos';
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
    getWorkHistory,
    isLoading,
    error,
  };
};
