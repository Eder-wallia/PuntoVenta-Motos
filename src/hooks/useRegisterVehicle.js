import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const useRegisterVehicle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const token = useAuthStore((state) => state.token);

  const registerVehicle = async (vehicleData) => {
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        clienteId: vehicleData.clienteId,
        tipo: vehicleData.tipo,
        marca: vehicleData.marca,
        modelo: vehicleData.modelo,
        color: vehicleData.color,
        placas: vehicleData.placas,
        kilometraje: vehicleData.kilometraje,
        observaciones: vehicleData.observaciones,
      };

      console.log('Enviando datos del vehículo:', payload);
      console.log('Token:', token ? 'Presente' : 'Ausente');

      const response = await axios.post('http://localhost:3000/api/vehiculos', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      console.log('Vehículo registrado exitosamente:', data);

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.error('Error al registrar vehículo:', err);
      console.error('Status:', err.response?.status);
      console.error('Error Response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrar vehículo';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getAllVehicles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Obteniendo todos los vehículos...');
      console.log('Token:', token ? 'Presente' : 'Ausente');

      const response = await axios.get('http://localhost:3000/api/vehiculos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;

      console.log('Vehículos obtenidos exitosamente:', data);
      console.log('Total de vehículos:', data.total);
      console.log('Lista de vehículos:', data.vehiculos);

      return {
        success: true,
        data: data.vehiculos || [],
        total: data.total || 0,
      };
    } catch (err) {
      console.error('Error al obtener vehículos:', err);
      console.error('Status:', err.response?.status);
      console.error('Error Response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error al obtener vehículos';
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
    registerVehicle,
    getAllVehicles,
    isLoading,
    error,
  };
};
