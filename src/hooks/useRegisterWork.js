import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useRegisterWork(vehicle) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [services, setServices] = useState([]);
  const [parts, setParts] = useState([]);
  const [labor, setLabor] = useState([]);
  const [observations, setObservations] = useState('');

  const [currentService, setCurrentService] = useState({ description: '', amount: '' });
  const [currentPart, setCurrentPart] = useState({ name: '', quantity: '', unitCost: '' });
  const [currentLabor, setCurrentLabor] = useState({ description: '', price: '' });

  // Funciones para servicios
  const addService = () => {
    if (!currentService.description.trim() || !currentService.amount) {
      setError('Completa descripción y monto del servicio');
      return;
    }
    setServices([
      ...services,
      {
        id: Date.now(),
        description: currentService.description,
        amount: parseFloat(currentService.amount),
      },
    ]);
    setCurrentService({ description: '', amount: '' });
    setError('');
  };

  const removeService = (id) => {
    setServices(services.filter((s) => s.id !== id));
  };

  // Funciones para refacciones
  const addPart = () => {
    if (!currentPart.name.trim() || !currentPart.quantity || !currentPart.unitCost) {
      setError('Completa nombre, cantidad y costo unitario de la refacción');
      return;
    }
    const quantity = parseFloat(currentPart.quantity);
    const unitCost = parseFloat(currentPart.unitCost);
    const total = quantity * unitCost;

    setParts([
      ...parts,
      {
        id: Date.now(),
        name: currentPart.name,
        quantity,
        unitCost,
        total,
      },
    ]);
    setCurrentPart({ name: '', quantity: '', unitCost: '' });
    setError('');
  };

  const removePart = (id) => {
    setParts(parts.filter((p) => p.id !== id));
  };

  // Funciones para mano de obra
  const addLabor = () => {
    if (!currentLabor.description.trim() || !currentLabor.price) {
      setError('Completa descripción y precio de mano de obra');
      return;
    }
    setLabor([
      ...labor,
      {
        id: Date.now(),
        description: currentLabor.description,
        price: parseFloat(currentLabor.price),
      },
    ]);
    setCurrentLabor({ description: '', price: '' });
    setError('');
  };

  const removeLabor = (id) => {
    setLabor(labor.filter((l) => l.id !== id));
  };

  // Cálculos de totales
  const calculateTotals = () => {
    const servicesTotal = services.reduce((sum, s) => sum + s.amount, 0);
    const partsTotal = parts.reduce((sum, p) => sum + p.total, 0);
    const laborTotal = labor.reduce((sum, l) => sum + l.price, 0);
    const budgetTotal = servicesTotal + partsTotal + laborTotal;

    return {
      servicesTotal,
      partsTotal,
      laborTotal,
      budgetTotal,
    };
  };

  const validateForm = () => {
    if (services.length === 0 && parts.length === 0 && labor.length === 0) {
      setError('Agrega al menos un servicio, refacción o mano de obra');
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
      const totals = calculateTotals();
      const workData = {
        vehicleId: vehicle.id,
        vehicle: vehicle,
        services,
        parts,
        labor,
        observations,
        totals,
        createdAt: new Date().toISOString(),
      };

      console.log('Datos del trabajo registrado:', workData);

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess('¡Trabajo registrado correctamente!');

      // Limpiar formulario
      setServices([]);
      setParts([]);
      setLabor([]);
      setObservations('');

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/vehicles');
      }, 2000);
    } catch (err) {
      setError('Error al registrar el trabajo');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/vehicles');
  };

  const totals = calculateTotals();

  return {
    // Estados
    loading,
    error,
    success,
    observations,
    // Servicios
    services,
    currentService,
    // Refacciones
    parts,
    currentPart,
    // Mano de obra
    labor,
    currentLabor,
    // Totales
    totals,
    // Funciones
    setCurrentService,
    addService,
    removeService,
    setCurrentPart,
    addPart,
    removePart,
    setCurrentLabor,
    addLabor,
    removeLabor,
    setObservations,
    handleSubmit,
    handleCancel,
  };
}
