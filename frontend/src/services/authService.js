// src/services/authService.js
import api from './api';

export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      console.log('Enviando datos de registro:', userData);
      
      const response = await api.post('/usuarios/registro', userData);
      
      console.log('Respuesta recibida:', response.data);
      
      // Guardar token y usuario si existen
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // El backend devuelve directamente el objeto Usuario/Administrador
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en authService.register:', error);
      
      if (error.response) {
        // El servidor respondió con un código de error
        const errorData = error.response.data;
        
        // Si el backend devuelve un string directamente
        if (typeof errorData === 'string') {
          throw {
            message: errorData,
            status: error.response.status
          };
        }
        
        throw {
          message: errorData.message || errorData.error || 'Error al registrar usuario',
          status: error.response.status,
          data: errorData,
          response: error.response
        };
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor en http://localhost:8081',
          request: error.request
        };
      } else {
        throw {
          message: error.message || 'Error desconocido'
        };
      }
    }
  },

  // Inicio de sesión
  login: async (credentials) => {
    try {
      console.log('Enviando credenciales de login:', { correo: credentials.correo });
      
      const response = await api.post('/usuarios/login', credentials);
      
      console.log('Respuesta de login:', response.data);
      
      // El backend devuelve: { usuario: {...}, token: "..." }
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data.usuario) {
        localStorage.setItem('user', JSON.stringify(response.data.usuario));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en authService.login:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        
        // Si el backend devuelve un string (como "Credenciales inválidas")
        if (typeof errorData === 'string') {
          throw {
            message: errorData,
            status: error.response.status
          };
        }
        
        throw {
          message: errorData.message || errorData.error || 'Credenciales inválidas',
          status: error.response.status,
          response: error.response
        };
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor'
        };
      } else {
        throw {
          message: error.message || 'Error al iniciar sesión'
        };
      }
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  // Obtener perfil del usuario
  getPerfil: async (email) => {
    try {
      const response = await api.get(`/usuarios/perfil/${email}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  // Actualizar perfil
  updatePerfil: async (email, datos) => {
    try {
      const response = await api.put(`/usuarios/perfil?email=${email}`, datos);
      
      // Actualizar localStorage con los nuevos datos
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // Eliminar perfil
  deletePerfil: async (email) => {
    try {
      const response = await api.delete(`/usuarios/perfil?email=${email}`);
      
      // Limpiar localStorage
      authService.logout();
      
      return response.data;
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      throw error;
    }
  }
};

export default authService;