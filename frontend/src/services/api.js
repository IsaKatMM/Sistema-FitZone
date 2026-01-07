// src/services/api.js
import axios from 'axios';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token agregado a la petición:', config.url);
    } else {
      console.warn('⚠️ No hay token disponible para:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ Respuesta exitosa de:', response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Error en respuesta de:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    
    // Si el token es inválido o expiró (401)
    if (error.response?.status === 401) {
      console.error('🚨 Token inválido o expiró');
      
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir al login solo si no estamos ya ahí
      if (!window.location.pathname.includes('/login')) {
        console.log('🔄 Redirigiendo al login...');
        window.location.href = '/login';
      }
    }
    
    // Si es un error de permisos (403)
    if (error.response?.status === 403) {
      console.error('🚨 No tienes permisos para esta acción');
    }
    
    return Promise.reject(error);
  }
);

export default api;