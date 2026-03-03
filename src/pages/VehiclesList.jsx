import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SAMPLE_VEHICLES, getVehicleDisplayName, getVehicleType } from '../constants/sampleVehicles';
import './VehiclesList.css';

export function VehiclesList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar vehículos por búsqueda
  const filteredVehicles = SAMPLE_VEHICLES.filter((vehicle) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      vehicle.clientName.toLowerCase().includes(searchLower) ||
      vehicle.plates.toLowerCase().includes(searchLower) ||
      vehicle.model.toLowerCase().includes(searchLower) ||
      (vehicle.vehicleType === 'motorcycle'
        ? vehicle.motorcycleBrand.toLowerCase().includes(searchLower)
        : vehicle.carBrand.toLowerCase().includes(searchLower))
    );
  });

  const handleRegisterWork = (vehicle) => {
    navigate(`/register-work/${vehicle.id}`, { state: { vehicle } });
  };

  const handleViewHistory = (vehicle) => {
    navigate(`/history/${vehicle.id}`, { state: { vehicle } });
  };

  const handleRegisterVehicle = () => {
    navigate('/register-moto');
  };

  return (
    <div className="vehicles-container">
      <header className="vehicles-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/dashboard')}
          aria-label="Volver al dashboard"
        >
         ←   
        </button>
        <h1>🚗 Vehículos Registrados</h1>
        <button className="btn btn-register-new" onClick={handleRegisterVehicle}>
          + Registrar Nuevo Vehículo
        </button>
      </header>

      <main className="vehicles-main">
        <div className="search-section">
          <input
            type="text"
            placeholder="Buscar por cliente, placa, marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="btn-clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="empty-state">
            <p>
              {searchTerm
                ? `No se encontraron vehículos con "${searchTerm}"`
                : 'No hay vehículos registrados'}
            </p>
            <button className="btn btn-primary" onClick={handleRegisterVehicle}>
              Registrar el primer vehículo
            </button>
          </div>
        ) : (
          <div className="vehicles-grid">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-header">
                  <span className="vehicle-type">{getVehicleType(vehicle.vehicleType)}</span>
                  <span className="vehicle-plates">{vehicle.plates}</span>
                </div>

                <div className="vehicle-content">
                  <h3>{getVehicleDisplayName(vehicle)}</h3>

                  <div className="vehicle-info">
                    <div className="info-group">
                      <label>Cliente:</label>
                      <p>{vehicle.clientName}</p>
                    </div>

                    <div className="info-group">
                      <label>Contacto:</label>
                      <p>{vehicle.clientPhone}</p>
                      <p className="email">{vehicle.clientEmail}</p>
                    </div>

                    <div className="info-group">
                      <label>Dirección:</label>
                      <p>{vehicle.clientAddress}</p>
                    </div>

                    <div className="info-group">
                      <label>Datos del Vehículo:</label>
                      <p>
                        <strong>Marca:</strong>{' '}
                        {vehicle.vehicleType === 'motorcycle' ? vehicle.motorcycleBrand : vehicle.carBrand}
                      </p>
                      <p>
                        <strong>Modelo:</strong> {vehicle.model}
                      </p>
                      <p>
                        <strong>Color:</strong> {vehicle.color}
                      </p>
                      <p>
                        <strong>Km:</strong> {vehicle.mileage}
                      </p>
                    </div>

                    <div className="info-group">
                      <label>Registrado:</label>
                      <p>{new Date(vehicle.registrationDate).toLocaleDateString('es-CO')}</p>
                    </div>
                  </div>
                </div>

                <div className="vehicle-actions">
                  <button className="btn btn-primary" onClick={() => handleRegisterWork(vehicle)}>
                    🔧 Registrar Trabajo
                  </button>
                  <button className="btn btn-secondary" onClick={() => handleViewHistory(vehicle)}>
                    📋 Ver Historial
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default VehiclesList;
