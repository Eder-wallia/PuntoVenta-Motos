# 📦 Zustand Store - Autenticación

## Descripción

Se utiliza **Zustand** como gestor de estado global para manejar la autenticación, con persistencia automática en `localStorage`.

## Estructura Simple y Limpia

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      // Estado
      token: null,
      user: null,
      isLoading: false,

      // Setters
      setToken: (value) => set({ token: value }),
      setUser: (value) => set({ user: value }),
      setIsLoading: (value) => set({ isLoading: value }),

      // Métodos
      login: async (email, password) => { /* ... */ },
      logout: () => set({ token: null, user: null }),
      register: async (email, password, name) => { /* ... */ },
    }),
    {
      name: 'auth-storage', // Clave en localStorage
    }
  )
);
```

---

## Ventajas

✅ **Persistencia automática** - Token y usuario se guardan en localStorage  
✅ **Estado global** - Accesible desde cualquier componente  
✅ **Rendimiento** - Solo los componentes que lo usan se re-renderizan  
✅ **Simplricidad** - Sintaxis clara y mantenible  
✅ **Escalable** - Fácil de extender con más acciones  

---

## Estado

```javascript
{
  token: null | string,        // JWT token
  user: null | object,         // { _id, email, name, role }
  isLoading: false | true,     // Estado de carga
}
```

---

## Acciones Disponibles

### Setters Básicos

```javascript
setToken(value)      // Establecer token
setUser(value)       // Establecer usuario
setIsLoading(value)  // Establecer loading
```

### Métodos Principales

```javascript
// Login (async)
await login(email, password)

// Logout
logout()

// Registro (async)
await register(email, password, name)

// Limpiar todo
clearAuth()
```

---

## Uso en Componentes

### Acceso simple

```javascript
import useAuthStore from '../store/authStore';

function MyComponent() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const login = useAuthStore((state) => state.login);

  return <div>{user?.name}</div>;
}
```

### En formularios

```javascript
function LoginForm() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Los datos se guardan automáticamente en localStorage
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
      <button disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}
```

### En HOC

```javascript
export const withAuth = (WrappedComponent) => {
  const ProtectedComponent = (props) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    if (!token) {
      return <Navigate to="/login" replace />;
    }

    return <WrappedComponent {...props} user={user} />;
  };
  
  return ProtectedComponent;
};
```

---

## localStorage

**Clave:** `auth-storage`

**Contenido:**
```json
{
  "state": {
    "token": "mock-token-1-1234567890",
    "user": {
      "_id": "1",
      "email": "admin@ejemplo.com",
      "name": "Administrador",
      "role": "user"
    },
    "isLoading": false
  }
}
```

---

## Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. Login page llama: await login(email, password)
   ↓
3. Store valida y retorna token + user
   ↓
4. localStorage SE ACTUALIZA AUTOMÁTICAMENTE
   ↓
5. Componentes se re-renderizan (solo suscritos)
   ↓
6. Router redirige a /dashboard
   ↓
7. HOC verifica token
   ↓
8. Dashboard renderiza
```

---

## Logout

```javascript
const logout = useAuthStore((state) => state.logout);

const handleLogout = () => {
  logout(); // localStorage se limpia automáticamente
  navigate('/login');
};
```

---

## Obtener Estado Global sin Suscripción

```javascript
// Para obtener el estado actual sin suscribirse
const state = useAuthStore.getState();
console.log(state.token);
console.log(state.user);
```

---

## Agregar más acciones

Ejemplo de extensión:

```javascript
const useAuthStore = create(
  persist(
    (set) => ({
      // ... estado existente ...
      
      // Nueva acción
      updateProfile: async (updates) => {
        set({ isLoading: true });
        try {
          // Aquí irían peticiones al API
          const user = useAuthStore.getState().user;
          set({ user: { ...user, ...updates } });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    { name: 'auth-storage' }
  )
);
```

---

## Cambiar a Backend Real

Solo reemplaza la lógica en `login()` y `register()`:

```javascript
login: async (email, password) => {
  set({ isLoading: true });
  try {
    const response = await fetch('https://tu-api.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en login');
    }
    
    set({
      token: data.token,
      user: data.user,
      isLoading: false,
    });
    
    return data;
  } catch (error) {
    set({ isLoading: false });
    throw error;
  }
},
```

---

## Debugging

### Ver estado actual

```javascript
useAuthStore.getState()
```

### Escuchar cambios

```javascript
const unsub = useAuthStore.subscribe(
  (state) => state.token,
  (token) => console.log('Token actualizado:', token)
);

// Dejar de escuchar
unsub();
```

### Ver en DevTools

```bash
npm install zustand zustand-devtools
```

Luego en la consola de Redux DevTools Chrome Extension verás todos los cambios.

