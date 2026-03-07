import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterVehicle } from '../hooks/useRegisterVehicle';
import { useRegisterClient } from '../hooks/useRegisterClient';
import './VehiclesList.css';

export function VehiclesList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllVehicles } = useRegisterVehicle();
  const { getAllClients } = useRegisterClient();

  // Cargar vehículos Y clientes del backend al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando vehículos y clientes del API...');
      
      try {
        // Cargar ambos en paralelo
        const [vehiclesResult, clientesResult] = await Promise.all([
          getAllVehicles(),
          getAllClients()
        ]);

        console.log('📦 Resultado de vehículos:', vehiclesResult);
        console.log('📦 Resultado de clientes:', clientesResult);

        if (vehiclesResult.success && clientesResult.success) {
          // Crear mapa de clientes por clienteId para búsqueda rápida
          const clientesMap = {};
          clientesResult.data.forEach(cliente => {
            clientesMap[cliente.clienteId] = cliente;
          });

          console.log('🗺️ Mapa de clientes:', clientesMap);

          // Enriquecer vehículos con datos del cliente
          const vehiclesEnriquecidos = vehiclesResult.data.map(vehicle => ({
            ...vehicle,
            cliente: clientesMap[vehicle.clienteId] || null
          }));

          console.log('✅ Vehículos enriquecidos:', vehiclesEnriquecidos);
          setVehicles(vehiclesEnriquecidos);
        } else {
          const errorMsg = vehiclesResult.error || clientesResult.error || 'Error al cargar datos';
          console.log('❌ Error:', errorMsg);
          setError(errorMsg);
        }
      } catch (err) {
        console.error('❌ Error general:', err);
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtrar vehículos por búsqueda (incluye datos del cliente)
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchLower = searchTerm.toLowerCase();
    const cliente = vehicle.cliente || {};
    return (
      vehicle.clienteId.toLowerCase().includes(searchLower) ||
      vehicle.placas.toLowerCase().includes(searchLower) ||
      vehicle.modelo.toLowerCase().includes(searchLower) ||
      vehicle.marca.toLowerCase().includes(searchLower) ||
      (cliente.nombre && cliente.nombre.toLowerCase().includes(searchLower)) ||
      (cliente.telefono && cliente.telefono.toLowerCase().includes(searchLower))
    );
  });

  const handleRegisterWork = (vehicle) => {
    navigate(`/register-work/${vehicle._id}`, { state: { vehicle } });
  };

  const handleViewHistory = (vehicle) => {
    navigate(`/history/${vehicle._id}`, { state: { vehicle } });
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
            placeholder="Buscar por cliente, teléfono, placa, marca o modelo..."
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

        {loading ? (
          <div className="empty-state">
            <p>Cargando vehículos...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>❌ Error al cargar vehículos: {error}</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Reintentar
            </button>
          </div>
        ) : filteredVehicles.length === 0 ? (
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
              <div key={vehicle._id} className="vehicle-card">
                <div className="vehicle-header">
                  <span className="vehicle-type">{vehicle.tipo.toUpperCase()}</span>
                  <span className="vehicle-plates">{vehicle.placas}</span>
                </div>

                <div className="vehicle-content">
                  <h3>{vehicle.marca} {vehicle.modelo}</h3>

                  <div className="vehicle-info">
                    <div className="info-group">
                      <label>Cliente:</label>
                      <p><strong>{vehicle.cliente?.nombre || 'Información no disponible'}</strong></p>
                      {vehicle.cliente && (
                        <>
                          <p><strong>Teléfono:</strong> {vehicle.cliente.telefono}</p>
                          <p><strong>Email:</strong> {vehicle.cliente.email}</p>
                          <p><strong>Domicilio:</strong> {vehicle.cliente.domicilio}</p>
                        </>
                      )}
                    </div>

                    <div className="info-group">
                      <label>Datos del Vehículo:</label>
                      <p>
                        <strong>Marca:</strong> {vehicle.marca}
                      </p>
                      <p>
                        <strong>Modelo:</strong> {vehicle.modelo}
                      </p>
                      <p>
                        <strong>Color:</strong> {vehicle.color}
                      </p>
                      <p>
                        <strong>Km:</strong> {vehicle.kilometraje}
                      </p>
                    </div>

                    <div className="info-group">
                      <label>Observaciones:</label>
                      <p>{vehicle.observaciones || 'Sin observaciones'}</p>
                    </div>

                    <div className="info-group">
                      <label>Registrado:</label>
                      <p>{new Date(vehicle.createdAt).toLocaleDateString('es-CO')}</p>
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
