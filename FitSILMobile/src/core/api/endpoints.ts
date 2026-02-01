// src/core/api/endpoints.ts
export const API_BASE_URL = 'http://192.168.1.3:8081';

export const ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/usuarios/registro',
  },
  
  // User
  USER: {
    PROFILE: (email: string) => `/usuarios/perfil/${email}`,
    UPDATE: '/usuarios/perfil',
    CHANGE_PASSWORD: '/usuarios/cambiar-contrasena',
  },
  
  // Exercises
  EXERCISES: {
    GET_ALL: '/ejercicios/obtener',
    SEARCH: '/ejercicios/buscar',
    IMAGE: (filename: string) => `/ejercicios/imagen/${filename}`,
  },
  
  // Routines
  ROUTINES: {
    GET_USER: '/api/rutinas/usuario',
    GET_BY_DAY: (day: string) => `/api/rutinas/dia/${day}`,
    ADD: '/api/rutinas/agregar',
    COMPLETE: (id: number) => `/api/rutinas/${id}/completar`,
    UPDATE: (id: number) => `/api/rutinas/${id}`,
    DELETE: (id: number) => `/api/rutinas/${id}`,
    STATS: '/api/rutinas/estadisticas',
    COMPLETE_DAY: (day: string) => `/api/rutinas/completar-dia/${day}`,
  },
  
  // Statistics
  STATISTICS: {
    DASHBOARD: '/api/estadisticas/usuario/dashboard',
    WEEK: '/api/estadisticas/usuario/semana',
    SUMMARY: '/api/estadisticas/usuario/resumen',
    BY_CATEGORY: '/api/estadisticas/usuario/categoria',
  },
  
  // Recipes
  RECIPES: {
    GET_ALL: '/recetas',
    GET_BY_ID: (id: number) => `/recetas/${id}`,
    SEARCH_NAME: '/recetas/buscar/nombre',
    SEARCH_INGREDIENT: '/recetas/buscar/ingrediente',
    FILTER: '/recetas/filtrar',
    RANDOM: '/recetas/aleatorias',
  },
  
  // Reports
  REPORTS: {
    MONTHLY: '/api/reportes/mensual',
    WEEKLY: '/api/reportes/semanal',
    CALORIES: '/api/reportes/calorias',
    HISTORY: '/api/reportes/historial',
    DOWNLOAD: (type: string) => `/api/reportes/descargar/${type}`,
    ADMIN_PUBLIC: '/api/reportes-admin/publicos',
    ADMIN_DOWNLOAD: (id: number) => `/api/reportes-admin/${id}/descargar`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    GET_USER: '/api/notificaciones-usuario',
    MARK_READ: (id: number) => `/api/notificaciones-usuario/${id}/leer`,
    DELETE: (id: number) => `/api/notificaciones-usuario/${id}`,
    COUNT_UNREAD: '/api/notificaciones-usuario/no-leidas/contar',
  },
};