import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentError, setCurrentError] = useState('');

  // Obtener estado del store
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  // Obtener usuarios de prueba (para mostrar en la UI)
  const mockUsers = [
    { email: 'admin@ejemplo.com', password: 'admin123', name: 'Administrador' },
    { email: 'usuario@ejemplo.com', password: 'usuario123', name: 'Usuario Prueba' },
    { email: 'mecanico@ejemplo.com', password: 'mecanico123', name: 'Mecánico' },
    { email: 'vendedor@ejemplo.com', password: 'vendedor123', name: 'Vendedor' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentError('');

    try {
      await login(email, password);
    } catch (err) {
      setCurrentError(err.toString());
    }
  };

  const handleQuickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword('');
    setCurrentError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏍️ PuntoVenta Motos</h1>
          <p>Sistema de Gestión</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {currentError && <div className="alert alert-error">{currentError}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Usuarios de prueba */}
        <div className="test-users">
          <p className="test-users-title">👤 Usuarios de prueba:</p>
          <div className="users-list">
            {mockUsers.map((user) => (
              <button
                key={user.email}
                type="button"
                className="user-btn"
                onClick={() => handleQuickLogin(user.email)}
                disabled={isLoading}
                title={`Email: ${user.email}\nContraseña: ${user.password}`}
              >
                <span className="user-role">👤</span>
                <span className="user-email">{user.email}</span>
              </button>
            ))}
          </div>
          <p className="test-hint">💡 Haz clic en un usuario para rellenar el email, luego ingresa la contraseña</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
