import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRegisterMoto() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [vehicleType, setVehicleType] = useState(''); // 'motorcycle' o 'car'

  const [formData, setFormData] = useState({
    // Datos cliente
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    clientAddress: '',
    
    // Datos vehiculo
    motorcycleBrand: '',
    carBrand: '',
    model: '',
    color: '',
    plates: '',
    mileage: '',
  });

  const handleVehicleTypeChange = (type) => {
    setVehicleType(type);
    setError('');
    // Limpiar los campos de marca al cambiar de tipo
    setFormData((prev) => ({
      ...prev,
      motorcycleBrand: '',
      carBrand: '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Si es el campo de teléfono, solo permitir números
    if (name === 'clientPhone') {
      const onlyNumbers = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        vehicleType: vehicleType,
      };
      console.log('Datos del registro:', dataToSubmit);
      
      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('¡Vehículo registrado correctamente!');
      setFormData({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        clientAddress: '',
        motorcycleBrand: '',
        carBrand: '',
        model: '',
        color: '',
        plates: '',
        mileage: '',
      });
      setVehicleType('');
      
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Error al registrar el vehículo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
  };
}
