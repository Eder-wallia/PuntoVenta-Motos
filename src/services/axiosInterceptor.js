import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Configurar interceptor global de axios para manejar token expirado
 */
export const setupAxiosInterceptor = () => {
  axios.interceptors.response.use(
    // Si la respuesta es exitosa, retornarla tal cual
    (response) => response,
    
    // Si hay error
    (error) => {
      const status = error.response?.status;

      // Si es 401 (Unauthorized - token expirado o inválido)
      if (status === 401) {
        console.error('❌ Token expirado o inválido. Redirigiendo a login...');
        
        // Obtener el logout del store
        const logout = useAuthStore.getState().logout;
        
        // Limpiar token y usuario
        logout();
        
        // Redirigir a login (esto se manejará en el componente que detecte que no hay token)
        window.location.href = '/login';
      }

      // Para otros errores, pasarlos adelante
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptor;
