import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { SAMPLE_VEHICLES, getVehicleDisplayName, getVehicleType } from '../constants/sampleVehicles';
import { getVehicleWorkHistory, calculateWorkTotal } from '../constants/sampleWorkHistory';
import './VehiclesHistory.css';

export function VehiclesHistory() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const location = useLocation();

  // Obtener vehículo del state de navegación o buscarlo en SAMPLE_VEHICLES
  const vehicle = location.state?.vehicle || SAMPLE_VEHICLES.find(v => v.id === vehicleId);

  if (!vehicle) {
    return (
      <div className="history-container">
        <div className="empty-state">
          <p>Vehículo no encontrado</p>
          <button className="btn btn-primary" onClick={() => navigate('/vehicles')}>
            Volver a Vehículos
          </button>
        </div>
      </div>
    );
  }

  // Obtener historial de trabajos
  const workHistory = getVehicleWorkHistory(vehicleId);

  const handleDownloadPDF = (work) => {
    // Crear contenido del PDF como string
    const content = `
HISTORIAL DE TRABAJO - ${getVehicleDisplayName(vehicle)}

Vehículo: ${getVehicleDisplayName(vehicle)}
Placa: ${vehicle.plates}
Tipo: ${getVehicleType(vehicle.vehicleType)}
Fecha de trabajo: ${new Date(work.date).toLocaleDateString('es-CO')}

--- SERVICIOS ---
${work.services.map(s => `${s.description}: $${s.amount.toLocaleString()}`).join('\n')}

--- REPUESTOS ---
${work.parts.length > 0 ? work.parts.map(p => `${p.name} (Qty: ${p.quantity}): $${(p.quantity * p.cost).toLocaleString()}`).join('\n') : 'Sin repuestos'}

--- MANO DE OBRA ---
${work.labor.map(l => `${l.description}: $${l.price.toLocaleString()}`).join('\n')}

--- TOTAL ---
Total: $${calculateWorkTotal(work).toLocaleString()}

Notas: ${work.notes}
    `;

    // Crear blob y descargar
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Historial_${vehicle.plates}_${new Date(work.date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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
              <h3>{getVehicleDisplayName(vehicle)}</h3>
              <p><strong>Placa:</strong> {vehicle.plates}</p>
              <p><strong>Cliente:</strong> {vehicle.clientName}</p>
              <p><strong>Contacto:</strong> {vehicle.clientPhone}</p>
            </div>
          </div>
        </section>

        {/* Historial de Trabajos */}
        {workHistory.length === 0 ? (
          <div className="empty-state">
            <p>No hay trabajos registrados para este vehículo</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate(`/register-work/${vehicleId}`, { state: { vehicle } })}
            >
              Registrar Primer Trabajo
            </button>
          </div>
        ) : (
          <section className="work-history-section">
            <h2>Trabajos Realizados</h2>
            <div className="work-list">
              {workHistory.map((work) => (
                <div key={work.id} className="work-item">
                  <div className="work-header">
                    <h4>{new Date(work.date).toLocaleDateString('es-CO')}</h4>
                    <span className={`status-badge status-${work.status}`}>
                      {work.status.charAt(0).toUpperCase() + work.status.slice(1)}
                    </span>
                  </div>

                  <div className="work-details">
                    {/* Servicios */}
                    <div className="detail-section">
                      <h5>Servicios</h5>
                      {work.services.length > 0 ? (
                        <ul>
                          {work.services.map((service, idx) => (
                            <li key={idx}>
                              <span>{service.description}</span>
                              <span>${service.amount.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-data">Sin servicios</p>
                      )}
                    </div>

                    {/* Repuestos */}
                    <div className="detail-section">
                      <h5>Repuestos/Materiales</h5>
                      {work.parts.length > 0 ? (
                        <ul>
                          {work.parts.map((part, idx) => (
                            <li key={idx}>
                              <span>{part.name} (Qty: {part.quantity})</span>
                              <span>${(part.quantity * part.cost).toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-data">Sin repuestos</p>
                      )}
                    </div>

                    {/* Mano de obra */}
                    <div className="detail-section">
                      <h5>Mano de Obra</h5>
                      {work.labor.length > 0 ? (
                        <ul>
                          {work.labor.map((labor, idx) => (
                            <li key={idx}>
                              <span>{labor.description}</span>
                              <span>${labor.price.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="no-data">Sin mano de obra</p>
                      )}
                    </div>

                    {/* Total */}
                    <div className="work-total">
                      <h5>Total:</h5>
                      <p className="total-amount">${calculateWorkTotal(work).toLocaleString()}</p>
                    </div>

                    {/* Notas */}
                    {work.notes && (
                      <div className="notes-section">
                        <h5>Notas:</h5>
                        <p>{work.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Botón Descargar PDF */}
                  <div className="work-actions">
                    <button 
                      className="btn btn-download"
                      onClick={() => handleDownloadPDF(work)}
                    >
                      📥 Descargar PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default VehiclesHistory;
