/**
 * Servicio de Autenticación - Mock (sin backend)
 * 
 * Para cambiar a backend real:
 * 1. Descomenta el código de axios
 * 2. Reemplaza mockUsers con peticiones reales al API
 * 3. Actualiza VITE_API_URL en .env
 */

// Usuarios de prueba
const mockUsers = [
  {
    _id: '1',
    email: 'admin@ejemplo.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'user',
  },
  {
    _id: '2',
    email: 'usuario@ejemplo.com',
    password: 'usuario123',
    name: 'Usuario Prueba',
    role: 'user',
  },
  {
    _id: '3',
    email: 'mecanico@ejemplo.com',
    password: 'mecanico123',
    name: 'Mecánico',
    role: 'user',
  },
  {
    _id: '4',
    email: 'vendedor@ejemplo.com',
    password: 'vendedor123',
    name: 'Vendedor',
    role: 'user',
  },
];

// Función para generar token simulado
const generateMockToken = (userId) => {
  return `mock-token-${userId}-${Date.now()}`;
};

// Función para simular delay de petición
const simulateDelay = (ms = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Servicio de autenticación
export const authService = {
  // Login
  login: async (email, password) => {
    try {
      // Simular delay de petición HTTP
      await simulateDelay(500);

      // Buscar usuario en lista simulada
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        throw new Error('Email o contraseña incorrectos');
      }

      // Generar token
      const token = generateMockToken(user._id);

      // Crear objeto usuario sin password
      const { _id, email, name, role } = user;
      const userWithoutPassword = { _id, email, name, role };

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return { token, user: userWithoutPassword };
    } catch (error) {
      throw error.message || 'Error en el login';
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtener token
  getToken: () => localStorage.getItem('token'),

  // Verificar si está autenticado
  isAuthenticated: () => !!localStorage.getItem('token'),

  // Registro (simula un nuevo usuario)
  register: async (email, password, name) => {
    try {
      await simulateDelay(500);

      // Verificar si el email ya existe
      if (mockUsers.some((u) => u.email === email)) {
        throw new Error('El email ya está registrado');
      }

      // Crear nuevo usuario
      const newUser = {
        _id: String(mockUsers.length + 1),
        email,
        password,
        name,
        role: 'user',
      };

      // Agregar a lista
      mockUsers.push(newUser);

      // Generar token
      const token = generateMockToken(newUser._id);

      // Crear objeto usuario sin password
      const userWithoutPassword = {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));

      return { token, user: userWithoutPassword };
    } catch (error) {
      throw error.message || 'Error en el registro';
    }
  },

  // Obtener usuarios de prueba disponibles (para desarrollo)
  getMockUsers: () => mockUsers.map(({ _id, email, name, role }) => ({
    _id,
    email,
    name,
    role,
  })),
};

export default authService;
