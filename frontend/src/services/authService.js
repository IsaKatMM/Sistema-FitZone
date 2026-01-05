// src/services/authService.js
import api from './api';

export const authService = {
  // Registro de USUARIO normal
  register: async (userData) => {
    try {
      console.log('📤 Enviando datos de registro de USUARIO:', userData);
      
      const response = await api.post('/usuarios/registro', userData);
      
      console.log('✅ Respuesta recibida:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en authService.register:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        
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

  // Registro de ADMINISTRADOR
  registerAdmin: async (adminData) => {
    try {
      console.log('📤 Enviando datos de registro de ADMINISTRADOR:', adminData);
      
      const response = await api.post('/administradores/registro', adminData);
      
      console.log('✅ Respuesta recibida:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en authService.registerAdmin:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        
        if (typeof errorData === 'string') {
          throw {
            message: errorData,
            status: error.response.status
          };
        }
        
        throw {
          message: errorData.message || errorData.error || 'Error al registrar administrador',
          status: error.response.status,
          data: errorData,
          response: error.response
        };
      } else if (error.request) {
        throw {
          message: 'No se pudo conectar con el servidor',
          request: error.request
        };
      } else {
        throw {
          message: error.message || 'Error desconocido'
        };
      }
    }
  },

  // Login UNIFICADO
  login: async (credentials) => {
    console.log('🔐 Intentando login con:', { correo: credentials.correo });
    
    // Intentar primero como usuario
    try {
      console.log('🔍 Intentando /usuarios/login...');
      const userResponse = await api.post('/usuarios/login', credentials);
      console.log('✅ LOGIN EXITOSO COMO USUARIO:', userResponse.data);
      
      if (userResponse.data.token) {
        localStorage.setItem('token', userResponse.data.token);
      }
      
      if (userResponse.data.usuario) {
        localStorage.setItem('user', JSON.stringify(userResponse.data.usuario));
      }
      
      return userResponse.data;
      
    } catch (userError) {
      console.log('⚠️ Login como usuario falló, intentando como administrador...');
      console.log('Error usuario:', userError.response?.status, userError.response?.data);
      
      // Si falla como usuario, intentar como administrador
      try {
        console.log('🔍 Intentando /administradores/login...');
        const adminResponse = await api.post('/administradores/login', credentials);
        console.log('✅ LOGIN EXITOSO COMO ADMINISTRADOR:', adminResponse.data);
        
        if (adminResponse.data.token) {
          localStorage.setItem('token', adminResponse.data.token);
        }
        
        if (adminResponse.data.usuario) {
          localStorage.setItem('user', JSON.stringify(adminResponse.data.usuario));
        }
        
        return adminResponse.data;
        
      } catch (adminError) {
        console.error('❌ Login falló en ambos endpoints');
        console.error('Error admin:', adminError.response?.status, adminError.response?.data);
        
        // Ambos fallaron, lanzar error
        if (adminError.response) {
          const errorData = adminError.response.data;
          
          if (typeof errorData === 'string') {
            throw {
              message: errorData,
              status: adminError.response.status
            };
          }
          
          throw {
            message: errorData.message || errorData.error || 'Credenciales inválidas',
            status: adminError.response.status,
            response: adminError.response
          };
        } else if (adminError.request) {
          throw {
            message: 'No se pudo conectar con el servidor. Verifica que esté corriendo en http://localhost:8081'
          };
        } else {
          throw {
            message: adminError.message || 'Error al iniciar sesión'
          };
        }
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
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // Actualizar perfil de administrador
  updateAdminPerfil: async (email, datos) => {
    try {
      const response = await api.put(`/administradores/perfil?email=${email}`, datos);
      
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil de admin:', error);
      throw error;
    }
  },

  // Eliminar perfil
  deletePerfil: async (email) => {
    try {
      const response = await api.delete(`/usuarios/perfil?email=${email}`);
      
      authService.logout();
      
      return response.data;
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      throw error;
    }
  },

  // Eliminar perfil de administrador
  deleteAdminPerfil: async (email) => {
    try {
      const response = await api.delete(`/administradores/perfil?email=${email}`);
      
      authService.logout();
      
      return response.data;
    } catch (error) {
      console.error('Error al eliminar perfil de admin:', error);
      throw error;
    }
  }
};

export default authService;