import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
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

      // Login
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          // Simulación de petición
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Datos simulados
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

          const foundUser = mockUsers.find(
            (u) => u.email === email && u.password === password
          );

          if (!foundUser) {
            throw new Error('Email o contraseña incorrectos');
          }

          const token = `mock-token-${foundUser._id}-${Date.now()}`;
          const userData = {
            _id: foundUser._id,
            email: foundUser.email,
            name: foundUser.name,
            role: foundUser.role,
          };

          set({
            token,
            user: userData,
            isLoading: false,
          });

          return { token, user: userData };
        } catch (error) {
          set({ isLoading: false });
          throw error.message || 'Error en el login';
        }
      },

      // Logout
      logout: () => set({ token: null, user: null }),

      // Registro
      register: async (email, password, name) => {
        set({ isLoading: true });
        try {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const token = `mock-token-new-${Date.now()}`;
          const userData = {
            _id: String(Date.now()),
            email,
            name,
            role: 'user',
          };

          set({
            token,
            user: userData,
            isLoading: false,
          });

          return { token, user: userData };
        } catch (error) {
          set({ isLoading: false });
          throw error.message || 'Error en el registro';
        }
      },

      // Utilidades
      clearAuth: () => set({ token: null, user: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
