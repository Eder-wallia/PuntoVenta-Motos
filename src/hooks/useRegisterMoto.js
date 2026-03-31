import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterClient } from './useRegisterClient';
import { useRegisterVehicle } from './useRegisterVehicle';
import { useVehicleStore } from '../store/vehicleStore';

export function useRegisterMoto() {
  const navigate = useNavigate();
  const { registerClient } = useRegisterClient();
  const { registerVehicle } = useRegisterVehicle();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Usar el store persistente para los datos del formulario
  const vehicleType = useVehicleStore((state) => state.vehicleType);
  const formData = useVehicleStore((state) => state.formData);
  const setVehicleType = useVehicleStore((state) => state.setVehicleType);
  const updateFormField = useVehicleStore((state) => state.updateFormField);
  const setFormData = useVehicleStore((state) => state.setFormData);
  const clearForm = useVehicleStore((state) => state.clearForm);

  const handleVehicleTypeChange = (type) => {
    setVehicleType(type);
    setError('');
    // Limpiar los campos de marca al cambiar de tipo
    setFormData({
      ...formData,
      motorcycleBrand: '',
      carBrand: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es el campo de teléfono, solo permitir números
    if (name === 'clientPhone') {
      const onlyNumbers = value.replace(/\D/g, '');
      updateFormField(name, onlyNumbers);
    } else {
      updateFormField(name, value);
    }
    setError('');
  };

  const validateForm = () => {
    // Validar tipo de vehículo
    if (!vehicleType) {
      setError('Selecciona si es una moto o un carro');
      return false;
    }

    // Validación básica datos cliente
    if (!formData.clientName.trim()) {
      setError('El nombre del cliente es requerido');
      return false;
    }
    if (!formData.clientPhone.trim()) {
      setError('El teléfono es requerido');
      return false;
    }
    if (!formData.clientEmail.trim()) {
      setError('El email es requerido');
      return false;
    }
    if (!formData.clientAddress.trim()) {
      setError('El domicilio es requerido');
      return false;
    }

    // Validación según tipo de vehículo
    if (vehicleType === 'motorcycle' && !formData.motorcycleBrand) {
      setError('Selecciona la marca de la moto');
      return false;
    }
    if (vehicleType === 'car' && !formData.carBrand) {
      setError('Selecciona la marca del carro');
      return false;
    }

    // Validación datos vehículo comunes
    if (!formData.model.trim()) {
      setError('El modelo es requerido');
      return false;
    }
    if (!formData.color.trim()) {
      setError('El color es requerido');
      return false;
    }
    if (!formData.plates.trim()) {
      setError('Las placas son requeridas');
      return false;
    }
    if (!formData.mileage.trim()) {
      setError('El kilometraje es requerido');
      return false;
    }
    if (!formData.observations.trim()) {
      setError('Las observaciones son requeridas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Paso 1: Registrar cliente
      const clientResult = await registerClient({
        nombre: formData.clientName,
        email: formData.clientEmail,
        telefono: formData.clientPhone,
        domicilio: formData.clientAddress,
      });

      if (!clientResult.success) {
        setError(clientResult.error || 'Error al registrar el cliente');
        setLoading(false);
        return;
      }

      console.log('Respuesta completa del cliente:', clientResult.data);

      // El servidor puede devolver el clienteId en diferentes lugares
      const responseData = clientResult.data;
      let clienteId = responseData.clienteId || 
                      responseData.cliente?.clienteId ||
                      responseData.data?.clienteId;
      
      console.log('Tipo de clienteId:', typeof clienteId);
      console.log('ClienteId extraído:', clienteId);
      console.log('Es truthy?', !!clienteId);

      // Esperar un poco para asegurar que MongoDB insertó correctamente
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!clienteId) {
        console.error('No se pudo extraer el clienteId. Respuesta del servidor:', responseData);
        setError('Error: No se obtuvo el ID del cliente. Verifique la respuesta del servidor.');
        setLoading(false);
        return;
      }

      // Paso 2: Registrar vehículo (con la información del cliente)
      const vehiclePayload = {
        clienteId: clienteId,
        tipo: vehicleType === 'motorcycle' ? 'moto' : 'carro',
        marca: vehicleType === 'motorcycle' ? formData.motorcycleBrand : formData.carBrand,
        modelo: formData.model,
        color: formData.color,
        placas: formData.plates,
        kilometraje: formData.mileage,
        observaciones: formData.observations,
      };
      
      console.log('Datos a enviar en vehículo:', vehiclePayload);
      
      const vehicleResult = await registerVehicle(vehiclePayload);

      if (!vehicleResult.success) {
        setError(vehicleResult.error || 'Error al registrar el vehículo');
        setLoading(false);
        return;
      }

      console.log('Vehículo registrado exitosamente:', vehicleResult.data);
      
      setSuccess('¡Vehículo y cliente registrados correctamente!');
      clearForm();
    } catch (err) {
      setError('Error al registrar el vehículo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    clearForm();
    navigate('/dashboard');
  };

  const handleCloseSuccess = () => {
    clearForm();
    navigate('/dashboard');
  };

  return {
    // Estados
    loading,
    error,
    success,
    vehicleType,
    formData,
    // Funciones
    handleVehicleTypeChange,
    handleChange,
    handleSubmit,
    handleCancel,
    handleCloseSuccess,
  };
}
