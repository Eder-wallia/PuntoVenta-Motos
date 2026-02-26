# 🔐 Sistema de Autenticación

## Descripción

El sistema implementa autenticación con un patrón **HOC (High Order Component)** para proteger rutas privadas.

### Estado Actual: ✅ MOCK (Sin Backend) - 4 Usuarios Iguales

Por ahora, el sistema funciona con **datos simulados en memoria** con 4 usuarios que tienen los mismos privilegios.

## 👤 Usuarios de Prueba

Puedes usar cualquiera de estos para probar (todos tienen los mismos privilegios):

| Email | Contraseña |
|-------|-----------|
| `admin@ejemplo.com` | `admin123` |
| `usuario@ejemplo.com` | `usuario123` |
| `mecanico@ejemplo.com` | `mecanico123` |
| `vendedor@ejemplo.com` | `vendedor123` |

**💡 Tip:** En la página de login puedes hacer clic en cada usuario para rellenar automáticamente el email.

---

## Arquitectura

### 1. **authService** (src/services/authService.js)

Servicio encargado de:
- ✅ Login de usuarios (MOCK)
- ✅ Registro de nuevos usuarios (MOCK)
- ✅ Logout
- ✅ Obtener usuario actual
- ✅ Verificar si hay sesión activa
- ✅ Listar usuarios de prueba

```javascript
// Ejemplo de uso
import { authService } from './services/authService';

// Login
const { token, user } = await authService.login('admin@ejemplo.com', 'admin123');

// Logout
authService.logout();

// Verificar autenticación
if (authService.isAuthenticated()) {
  const user = authService.getCurrentUser();
}

// Ver usuarios disponibles (desarrollo)
const users = authService.getMockUsers();
```

### 2. **withAuth HOC** (src/hoc/withAuth.jsx)

High Order Component que:
- ✅ Protege rutas privadas
- ✅ Verifica si existe token
- ✅ Redirige a login si no está autenticado
- ✅ Pasa usuario autenticado como prop

```javascript
// Uso en App.jsx
const ProtectedDashboard = withAuth(Dashboard);

<Route path="/dashboard" element={<ProtectedDashboard />} />
```

### 3. **Login Page** (src/pages/Login.jsx)

Página de login con:
- ✅ Formulario de email/password
- ✅ Lista de usuarios de prueba (clickeables)
- ✅ Validación de campos
- ✅ Manejo de errores
- ✅ Loading state
- ✅ Redirección a dashboard tras login exitoso

## Flujo de Autenticación

```
Usuario escribe credenciales
        ↓
Servicio valida contra lista local
        ↓
Genera token simulado
        ↓
Se guarda en localStorage
        ↓
Se redirige a /dashboard
        ↓
withAuth verifica token
        ↓
Carga Dashboard si es válido
```

---

# 🔄 Cambiar a Backend Real

Cuando tengas un backend listo, solo necesitas:

## 1. Instalar Axios

```bash
npm install axios
```

## 2. Reemplazar authService.js

El servicio original con axios está comentado en el código. Cambia `src/services/authService.js` por:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const AUTH_API = `${API_URL}/auth`;

const authApi = axios.create({
  baseURL: AUTH_API,
  headers: { 'Content-Type': 'application/json' },
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email, password) => {
    const { data } = await authApi.post('/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  getToken: () => localStorage.getItem('token'),
  
  isAuthenticated: () => !!localStorage.getItem('token'),
  
  register: async (email, password, name) => {
    const { data } = await authApi.post('/register', { email, password, name });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },
};
```

## 3. Configurar Variables de Entorno

```env
VITE_API_URL=http://localhost:3000/api
```

## 4. Backend Endpoints Esperados

### POST `/api/auth/login`
**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "usuario-id",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "admin"
  }
}
```

### POST `/api/auth/register`
**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Nombre Usuario"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "usuario-id",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario"
  }
}
```

---

## Almacenamiento Local

El sistema guarda en `localStorage`:
- `token`: JWT para autenticar peticiones
- `user`: Datos del usuario en JSON

```javascript
// Acceso manual
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
```

---

## Seguridad

⚠️ **IMPORTANTE**: 

- ✅ Nunca guardes información sensible en localStorage (actualmente es MOCK)
- ✅ Usa HTTPS en producción
- ✅ Implementa CORS en el backend
- ✅ Revoca tokens en logout
- ✅ Implementa refresh tokens (próxima mejora)
- ✅ Valida token en el backend para cada petición
- ✅ Usa HttpOnly cookies si es posible (más seguro que localStorage)

---

## Mejoras Futuras

- [ ] Refresh tokens
- [ ] Logout en el backend
- [ ] Recuperación de contraseña
- [ ] Validación de email
- [ ] 2FA (Two-Factor Authentication)
- [ ] Social login (Google, GitHub)
- [ ] HttpOnly cookies en lugar de localStorage

