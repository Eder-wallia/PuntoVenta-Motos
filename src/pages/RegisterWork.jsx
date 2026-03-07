import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegisterWork } from '../hooks/useRegisterWork';
import { useRegisterVehicle } from '../hooks/useRegisterVehicle';
import './RegisterWork.css';

export function RegisterWork() {
  const navigate = useNavigate();
  const location = useLocation();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [vehicleError, setVehicleError] = useState(null);

  const { getAllVehicles } = useRegisterVehicle();

  // Llamar hook antes de cualquier condicional
  const {
    loading,
    error,
    success,
    observations,
    services,
    currentService,
    parts,
    currentPart,
    labor,
    currentLabor,
    totals,
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
  } = useRegisterWork(selectedVehicle || {});

  // Cargar vehículos al montar el componente
  useEffect(() => {
    const loadVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const result = await getAllVehicles();
        if (result.success) {
          setVehicles(result.data);
          
          // Si viene un vehículo en el state desde VehiclesList, usarlo directamente
          if (location.state?.vehicle) {
            console.log('🚗 Vehículo pre-seleccionado desde VehiclesList:', location.state.vehicle);
            setSelectedVehicle(location.state.vehicle);
          }
        } else {
          setVehicleError(result.error);
        }
      } catch (err) {
        console.error('Error cargando vehículos:', err);
        setVehicleError('Error al cargar vehículos');
      } finally {
        setLoadingVehicles(false);
      }
    };
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectVehicle = (vehicleId) => {
    const vehicle = vehicles.find(v => v._id === vehicleId);
    setSelectedVehicle(vehicle);
  };

  // Mostrar selector de vehículos si no hay uno seleccionado
  if (!selectedVehicle) {
    return (
      <div className="work-container">
        <div className="work-card">
          <div className="vehicle-summary">
            <h1>🔧 Registrar Trabajo</h1>
            <p>Selecciona un vehículo para registrar el trabajo</p>
          </div>

          {vehicleError && <div className="alert alert-error">{vehicleError}</div>}

          {loadingVehicles ? (
            <div className="loading-message">
              <p>Cargando vehículos...</p>
            </div>
          ) : vehicles.length === 0 ? (
            <div className="error-message">
              <p>No hay vehículos registrados</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/register-moto')}
              >
                Registrar un vehículo
              </button>
            </div>
          ) : (
            <div className="vehicle-selection">
              <fieldset className="form-section">
                <legend>Seleccionar Vehículo</legend>
                <div className="vehicles-list">
                  {vehicles.map((vehicle) => (
                    <button
                      key={vehicle._id}
                      type="button"
                      onClick={() => handleSelectVehicle(vehicle._id)}
                      className="vehicle-select-btn"
                    >
                      <div className="vehicle-select-info">
                        <span className="vehicle-type">{vehicle.tipo}</span>
                        <span className="vehicle-model">{vehicle.marca} {vehicle.modelo}</span>
                        <span className="vehicle-plates">{vehicle.placas}</span>
                      </div>
                      <span className="select-arrow">→</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mostrar formulario de trabajo con vehículo seleccionado

  return (
    <div className="work-container">
      <div className="work-card">
        {/* Información del Vehículo */}
        <div className="vehicle-summary">
          <div className="summary-header">
            <button 
              className="btn-back-register"
              onClick={() => navigate('/vehicles')}
              aria-label="Volver atrás"
            >
              ←
            </button>
            <h1>🔧 Registrar Trabajo</h1>
          </div>
          <div className="vehicle-info-summary">
            <span className="vehicle-type-badge">{selectedVehicle.tipo.toUpperCase()}</span>
            <h2>{selectedVehicle.marca} {selectedVehicle.modelo}</h2>
            <p><strong>Placas:</strong> {selectedVehicle.placas}</p>
            <p><strong>Color:</strong> {selectedVehicle.color}</p>
            <p><strong>Kilometraje:</strong> {selectedVehicle.kilometraje} km</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="work-form">
          {/* Sección: Servicios */}
          <fieldset className="form-section">
            <legend>Servicios</legend>

            <div className="service-input-group">
              <div className="form-group">
                <label>Descripción del servicio</label>
                <input
                  type="text"
                  value={currentService.description}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, description: e.target.value })
                  }
                  placeholder="Ej: Cambio de aceite"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Monto</label>
                <input
                  type="number"
                  value={currentService.amount}
                  onChange={(e) => setCurrentService({ ...currentService, amount: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                onClick={addService}
                className="btn btn-add"
                disabled={loading}
              >
                + Agregar
              </button>
            </div>

            {services.length > 0 && (
              <div className="items-list">
                {services.map((service) => (
                  <div key={service.id} className="list-item">
                    <div className="item-content">
                      <span className="item-name">{service.description}</span>
                      <span className="item-amount">${service.amount.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="btn-remove"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {/* Sección: Refacciones y Materiales */}
          <fieldset className="form-section">
            <legend>Refacciones y Materiales</legend>

            <div className="parts-input-group">
              <div className="form-group">
                <label>Nombre de la refacción</label>
                <input
                  type="text"
                  value={currentPart.name}
                  onChange={(e) => setCurrentPart({ ...currentPart, name: e.target.value })}
                  placeholder="Ej: Pastillas de freno"
                  disabled={loading}
                />
              </div>
              <div className="form-group-small">
                <label>Cantidad</label>
                <input
                  type="number"
                  value={currentPart.quantity}
                  onChange={(e) => setCurrentPart({ ...currentPart, quantity: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
              <div className="form-group-small">
                <label>Costo U.</label>
                <input
                  type="number"
                  value={currentPart.unitCost}
                  onChange={(e) => setCurrentPart({ ...currentPart, unitCost: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                onClick={addPart}
                className="btn btn-add"
                disabled={loading}
              >
                + Agregar
              </button>
            </div>

            {parts.length > 0 && (
              <div className="items-list">
                {parts.map((part) => (
                  <div key={part.id} className="list-item">
                    <div className="item-content">
                      <span className="item-name">{part.name}</span>
                      <span className="item-details">
                        {part.quantity} x ${part.unitCost.toFixed(2)} = $
                        {part.total.toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePart(part.id)}
                      className="btn-remove"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {/* Sección: Mano de Obra */}
          <fieldset className="form-section">
            <legend>Mano de Obra</legend>

            <div className="labor-input-group">
              <div className="form-group">
                <label>Descripción mano de obra</label>
                <input
                  type="text"
                  value={currentLabor.description}
                  onChange={(e) =>
                    setCurrentLabor({ ...currentLabor, description: e.target.value })
                  }
                  placeholder="Ej: Reparación de motor"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input
                  type="number"
                  value={currentLabor.price}
                  onChange={(e) => setCurrentLabor({ ...currentLabor, price: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                onClick={addLabor}
                className="btn btn-add"
                disabled={loading}
              >
                + Agregar
              </button>
            </div>

            {labor.length > 0 && (
              <div className="items-list">
                {labor.map((item) => (
                  <div key={item.id} className="list-item">
                    <div className="item-content">
                      <span className="item-name">{item.description}</span>
                      <span className="item-amount">${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLabor(item.id)}
                      className="btn-remove"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </fieldset>

          {/* Sección: Observaciones Técnicas */}
          <fieldset className="form-section">
            <legend>Observaciones Técnicas / Diagnóstico</legend>

            <div className="form-group">
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Escribe aquí las observaciones técnicas o diagnóstico del vehículo..."
                rows="6"
                disabled={loading}
              />
            </div>
          </fieldset>

          {/* Sección: Resumen Financiero */}
          <fieldset className="form-section summary-section">
            <legend>Resumen Financiero</legend>

            <div className="summary-grid">
              <div className="summary-item">
                <label>Servicios Total</label>
                <span className="summary-value">${totals.servicesTotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <label>Refacciones Total</label>
                <span className="summary-value">${totals.partsTotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <label>Mano de Obra Total</label>
                <span className="summary-value">${totals.laborTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <label>Total del Presupuesto</label>
              <span className="total-value">${totals.budgetTotal.toFixed(2)}</span>
            </div>

            <div className="summary-additional">
              <div className="form-group">
                <label>Anticipo / A Cuenta</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Restante por Pagar</label>
                <input
                  type="number"
                  value={totals.budgetTotal.toFixed(2)}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </fieldset>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Trabajo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterWork;
