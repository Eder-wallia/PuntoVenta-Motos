import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import faviconIcon from '../assets/logo-mc.svg';
import './Dashboard.css';

export function Dashboard() {
  const navigate = useNavigate();
  
  // Obtener usuario y logout del store
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <img src={faviconIcon} alt="Logo" className="header-icon" />
            <h1>Sistema de Gestión de Vehiculos</h1>
          </div>
          <div className="user-info">
            <span>Bienvenido, <strong>{user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1) : user?.email}</strong></span>
            <button onClick={handleLogout} className="btn btn-logout">
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="dashboard-section">
          <h2>Módulos disponibles</h2>
          <div className="modules-grid">
            {user?.role === 'administrador' && (
              <div className="module-card">
                <h3>📝 Registrar Vehiculo</h3>
                <p>Crear un nuevo registro de vehiculo en el sistema</p>
                <button 
                  className="btn-secondary btn"
                  onClick={() => handleNavigate('/register-moto')}
                >
                  Ir
                </button>
              </div>
            )}

            {(user?.role === 'administrador' || user?.role === 'mecanico') && (
              <div className="module-card">
                <h3>🔧 Registrar Trabajo</h3>
                <p>Registrar trabajos realizados a los vehiculos</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleNavigate('/vehicles')}
                >
                  Ir
                </button>
              </div>
            )}

            {/* <div className="module-card">
              <h3>📊 Ver Vehiculos</h3>
              <p>Consultar y editar información de vehiculos</p>
              <button 
                className="btn btn-secondary"
                onClick={() => handleNavigate('/vehicles')}
              >
                Ir
              </button>
            </div> */}

            {/* <div className="module-card">
              <h3>Datos Cliente</h3>
              <p>Descargar reportes en PDF con historial completo</p>
              <button className="btn btn-secondary">Ir</button>
            </div> */}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
