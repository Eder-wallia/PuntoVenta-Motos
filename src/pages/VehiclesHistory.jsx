import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useHistoryVehicle } from '../hooks/useHistoryVehicle';
import './VehiclesHistory.css';

export function VehiclesHistory() {
  const navigate = useNavigate();
  const location = useLocation();
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getWorkHistory, downloadWorkPDF } = useHistoryVehicle();

  // Obtener vehículo del state de navegación
  const vehicle = location.state?.vehicle;

  // Cargar historial de trabajos al montar el componente
  useEffect(() => {
    const loadWorkHistory = async () => {
      if (!vehicle) {
        setError('Vehículo no encontrado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      console.log('🔄 Cargando historial de trabajos para vehiculoId:', vehicle.vehiculoId);
      
      const result = await getWorkHistory(vehicle.vehiculoId);
      
      if (result.success) {
        console.log('✅ Trabajos cargados:', result.data);
        setTrabajos(result.data);
      } else {
        console.log('❌ Error cargando trabajos:', result.error);
        setError(result.error);
      }
      setLoading(false);
    };

    loadWorkHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle]);

  const handleDownloadPDF = async (trabajo) => {
    const result = await downloadWorkPDF(trabajo._id, vehicle);
    if (!result.success) {
      alert('Error al descargar el PDF. Intenta nuevamente.');
    }
  };

  if (!vehicle) {
    return (
      <div className="history-container">
        <div className="empty-state">
          <p>❌ Vehículo no encontrado</p>
          <button className="btn btn-primary" onClick={() => navigate('/vehicles')}>
            Volver a Vehículos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <header className="history-header">
        <button 
          className="btn-back"
          onClick={() => navigate('/vehicles')}
          aria-label="Volver a vehículos"
        >
          ←
        </button>
        <h1>📋 Historial de Trabajos</h1>
      </header>

      <main className="history-main">
        {/* Resumen del Vehículo */}
        <section className="vehicle-summary-section-history">
          <div className="vehicle-summary-history">
            <div className="summary-item-history">
              <h3>{vehicle.marca} {vehicle.modelo}</h3>
              <p><strong>Placa:</strong> {vehicle.placas}</p>
              <p><strong>Tipo:</strong> {vehicle.tipo.toUpperCase()}</p>
              <p><strong>Color:</strong> {vehicle.color}</p>
              <p><strong>Kilometraje:</strong> {vehicle.kilometraje} km</p>
            </div>
          </div>
        </section>

        {/* Historial de Trabajos */}
        {loading ? (
          <div className="empty-state">
            <p>Cargando historial de trabajos...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <p>❌ Error: {error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/vehicles')}>
              Volver a Vehículos
            </button>
          </div>
        ) : trabajos.length === 0 ? (
          <div className="empty-state">
            <p>No hay trabajos registrados para este vehículo</p>
          </div>
        ) : (
          <section className="work-history-section">
            <h2>Trabajos Realizados</h2>
            <div className="work-list">
              {trabajos.map((trabajo) => {
                const totalServicios = trabajo.servicios?.reduce((sum, s) => sum + s.monto, 0) || 0;
                const totalRefacciones = trabajo.refacciones?.reduce((sum, r) => sum + (r.cantidad * r.costoUnitario), 0) || 0;
                const totalManoObra = trabajo.manoDeObra?.reduce((sum, m) => sum + m.precio, 0) || 0;
                const totalPresupuesto = totalServicios + totalRefacciones + totalManoObra;

                return (
                  <div key={trabajo._id} className="work-item">
                    <div className="work-header">
                      <h4>{new Date(trabajo.createdAt).toLocaleDateString('es-CO')}</h4>
                      <span className={`status-badge status-${trabajo.estatus}`}>
                        {trabajo.estatus.charAt(0).toUpperCase() + trabajo.estatus.slice(1)}
                      </span>
                    </div>

                    <div className="work-details">
                      {/* Servicios */}
                      <div className="detail-section">
                        <h5>Servicios</h5>
                        {trabajo.servicios?.length > 0 ? (
                          <ul>
                            {trabajo.servicios.map((servicio, idx) => (
                              <li key={idx}>
                                <span>{servicio.descripcion}</span>
                                <span>${servicio.monto.toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-data">Sin servicios</p>
                        )}
                      </div>

                      {/* Refacciones */}
                      <div className="detail-section">
                        <h5>Refacciones/Materiales</h5>
                        {trabajo.refacciones?.length > 0 ? (
                          <ul>
                            {trabajo.refacciones.map((refaccion, idx) => (
                              <li key={idx}>
                                <span>{refaccion.nombre} (Qty: {refaccion.cantidad})</span>
                                <span>${(refaccion.cantidad * refaccion.costoUnitario).toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-data">Sin refacciones</p>
                        )}
                      </div>

                      {/* Mano de Obra */}
                      <div className="detail-section">
                        <h5>Mano de Obra</h5>
                        {trabajo.manoDeObra?.length > 0 ? (
                          <ul>
                            {trabajo.manoDeObra.map((mano, idx) => (
                              <li key={idx}>
                                <span>{mano.descripcion}</span>
                                <span>${mano.precio.toLocaleString()}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="no-data">Sin mano de obra</p>
                        )}
                      </div>

                      {/* Total */}
                      <div className="work-total">
                        <h5>Total Presupuesto:</h5>
                        <p className="total-amount">${totalPresupuesto.toLocaleString()}</p>
                      </div>

                      {/* Observaciones Técnicas */}
                      {trabajo.observacionesTecnicas && (
                        <div className="notes-section">
                          <h5>Observaciones Técnicas:</h5>
                          <p>{trabajo.observacionesTecnicas}</p>
                        </div>
                      )}
                    </div>

                    {/* Botón Descargar PDF */}
                    <div className="work-actions">
                      <button 
                        className="btn btn-download"
                        onClick={() => handleDownloadPDF(trabajo)}
                      >
                        📥 Descargar Reporte
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default VehiclesHistory;
