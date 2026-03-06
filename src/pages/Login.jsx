import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useLogin } from '../hooks/useLogin';
import './Login.css';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPass, setVerPass] = useState(false);
  const [currentError, setCurrentError] = useState('');

  // Hook de login con axios
  const { login: loginWithAxios, isLoading } = useLogin();

  // Obtener token del store para verificar autenticación
  const token = useAuthStore((state) => state.token);

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  // Obtener usuarios de prueba (para mostrar en la UI)
  // const mockUsers = [
  //   { email: 'admin@ejemplo.com', password: 'admin123', name: 'Administrador' },
  //   { email: 'usuario@ejemplo.com', password: 'usuario123', name: 'Usuario Prueba' },
  //   { email: 'mecanico@ejemplo.com', password: 'mecanico123', name: 'Mecánico' },
  //   { email: 'vendedor@ejemplo.com', password: 'vendedor123', name: 'Vendedor' },
  // ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentError('');

    try {
      const result = await loginWithAxios(email, password);
      if (result.success) {
        // El token se guardará en el store automáticamente por el hook
        // La redirección ocurrirá en el useEffect abajo
      } else {
        setCurrentError(result.error || 'Error en la autenticación');
      }
    } catch (err) {
      setCurrentError(err.message || 'Error desconocido');
    }
  };

  // const handleQuickLogin = (userEmail) => {
  //   setEmail(userEmail);
  //   setPassword('');
  //   setCurrentError('');
  // };

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
<div className="form-group" style={{position:'relative'}}>
  <label htmlFor="password">Contraseña</label>
  <input
    id="password"
    type={verPass ? 'text' : 'password'}
    pplaceholder=""
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    disabled={isLoading}
  />
  <button
    type="button"
    onClick={() => setVerPass(!verPass)}
    style={{position:'absolute', right:'12px', bottom:'10px', background:'none', border:'none', cursor:'pointer', fontSize:'16px'}}
  >
    {verPass ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)}
  </button>
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
        {/* <div className="test-users">
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
        </div> */}
      </div>
    </div>
  );
}

export default Login;
