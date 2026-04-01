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

  const { login: loginWithAxios, isLoading } = useLogin();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCurrentError('');
    try {
      const result = await loginWithAxios(email, password);
      if (!result.success) {
        setCurrentError(result.error || 'Error en la autenticación');
      }
    } catch (err) {
      setCurrentError(err.message || 'Error desconocido');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Windows 2000 Title Bar */}
        <div className="win-titlebar">
          <div className="win-titlebar-left">
            <span className="win-titlebar-icon">🏍️</span>
            <span className="win-titlebar-title">PuntoVenta Motos – Iniciar Sesión</span>
          </div>
          <div className="win-titlebar-buttons">
            <div className="win-titlebar-btn">_</div>
            <div className="win-titlebar-btn">□</div>
            <div className="win-titlebar-btn close">✕</div>
          </div>
        </div>

        {/* Header */}
        <div className="login-header">
          <h1>🏍️ PuntoVenta Motos</h1>
          <p>Sistema de Gestión</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {currentError && (
            <div className="alert alert-error">{currentError}</div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email:</label>
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

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type={verPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setVerPass(!verPass)}
              style={{
                position: 'absolute',
                right: '6px',
                bottom: '5px',
                background: 'none',
                border: 'none',
                cursor: 'default',
                fontSize: '14px',
                padding: '0',
                color: '#000000',
              }}
              aria-label={verPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {verPass ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4px' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '140px' }}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        {/* Windows 2000 Status Bar */}
        <div className="win-statusbar">
          <div className="win-statusbar-panel">
            {isLoading ? 'Autenticando...' : 'Listo'}
          </div>
          <div className="win-statusbar-panel">
            Sistema de Gestión v1.0
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;
