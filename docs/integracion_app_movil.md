# Integración App Móvil - FitSIL

## Tabla de Contenidos
- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Endpoints Consumidos](#endpoints-consumidos)
- [Ejemplos de Solicitud y Respuesta](#ejemplos-de-solicitud-y-respuesta)
- [Manejo de Errores](#manejo-de-errores)
- [Configuración](#configuración)

---

## Descripción General

**FitSIL** es una aplicación móvil desarrollada en **React Native** con **Expo** que permite a los usuarios gestionar sus rutinas de ejercicio, realizar seguimiento de progreso y recibir notificaciones personalizadas.

### Tecnologías Utilizadas
- **Frontend Mobile**: React Native + Expo Router
- **Backend**: Spring Boot (Java)
- **Base de Datos**: PostgreSQL
- **Arquitectura**: Clean Architecture
- **Autenticación**: JWT (JSON Web Tokens)
- **Almacenamiento Local**: Expo SecureStore

---

## Arquitectura

### Estructura del Proyecto

```
src/
├── core/
│   ├── api/
│   │   ├── apiClient.ts          # Cliente HTTP (Axios)
│   │   └── endpoints.ts          # Definición de endpoints
│   └── events/
│       └── EventBus.ts           # Sistema de eventos
├── data/
│   ├── datasources/              # Fuentes de datos (API calls)
│   ├── models/                   # DTOs
│   ├── mappers/                  # Conversión DTO ↔ Entity
│   └── repositories/             # Implementación de repositorios
├── domain/
│   ├── entities/                 # Entidades del dominio
│   └── repositories/             # Interfaces de repositorios
└── presentation/
    ├── context/                  # Context API (Estado global)
    ├── hooks/                    # Custom Hooks
    ├── screens/                  # Pantallas de la app
    └── components/               # Componentes reutilizables
```

### Flujo de Datos

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────┐
│   Screen    │────▶│  Custom Hook │────▶│ Repository  │────▶│   API    │
│ (UI Layer)  │◀────│   (Logic)    │◀────│   (Data)    │◀────│ Backend  │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────┘
```

---

## Endpoints Consumidos

### Base URL
```
http://192.168.1.4:8081/api
```

### 1. Autenticación

#### 1.1 Login
- **Endpoint**: `POST /auth/login`
- **Descripción**: Autentica al usuario y retorna un token JWT
- **Autenticación**: No requerida

#### 1.2 Registro de Usuario
- **Endpoint**: `POST /auth/register`
- **Descripción**: Registra un nuevo usuario en el sistema
- **Autenticación**: No requerida

#### 1.3 Registro de Administrador
- **Endpoint**: `POST /auth/register-admin`
- **Descripción**: Registra un nuevo administrador
- **Autenticación**: No requerida
- **Requiere**: Código de administrador válido

---

### 2. Usuarios

#### 2.1 Obtener Perfil por Email
- **Endpoint**: `GET /usuarios/email/{email}`
- **Descripción**: Obtiene la información del perfil del usuario
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `email` (path) - Email del usuario

#### 2.2 Actualizar Usuario
- **Endpoint**: `PUT /usuarios?email={email}`
- **Descripción**: Actualiza la información del usuario
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `email` (query) - Email del usuario

---

### 3. Ejercicios

#### 3.1 Listar Ejercicios
- **Endpoint**: `GET /ejercicios`
- **Descripción**: Obtiene la lista de todos los ejercicios disponibles
- **Autenticación**: Requerida (JWT)

#### 3.2 Obtener Ejercicio por ID
- **Endpoint**: `GET /ejercicios/{id}`
- **Descripción**: Obtiene los detalles de un ejercicio específico
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `id` (path) - ID del ejercicio

---

### 4. Rutinas

#### 4.1 Listar Rutinas del Usuario
- **Endpoint**: `GET /rutinas-usuario`
- **Descripción**: Obtiene todas las rutinas del usuario autenticado
- **Autenticación**: Requerida (JWT)

#### 4.2 Crear Rutina
- **Endpoint**: `POST /rutinas-usuario`
- **Descripción**: Crea una nueva rutina para el usuario
- **Autenticación**: Requerida (JWT)

#### 4.3 Actualizar Rutina
- **Endpoint**: `PUT /rutinas-usuario/{id}`
- **Descripción**: Actualiza una rutina existente
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `id` (path) - ID de la rutina

#### 4.4 Completar Rutina
- **Endpoint**: `PUT /rutinas-usuario/{id}/completar`
- **Descripción**: Marca una rutina como completada o no completada (toggle)
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `id` (path) - ID de la rutina

#### 4.5 Eliminar Rutina
- **Endpoint**: `DELETE /rutinas-usuario/{id}`
- **Descripción**: Elimina una rutina del usuario
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `id` (path) - ID de la rutina

---

### 5. Notificaciones

#### 5.1 Listar Notificaciones
- **Endpoint**: `GET /notificaciones-usuario`
- **Descripción**: Obtiene todas las notificaciones del usuario
- **Autenticación**: Requerida (JWT)

#### 5.2 Marcar como Leída
- **Endpoint**: `PUT /notificaciones-usuario/{id}/leer`
- **Descripción**: Marca una notificación como leída
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `id` (path) - ID de la notificación

#### 5.3 Eliminar Notificación
- **Endpoint**: `DELETE /notificaciones-usuario/{id}`
- **Descripción**: Elimina una notificación
- **Autenticación**: Requerida (JWT)
- **Parámetros**: 
  - `id` (path) - ID de la notificación

#### 5.4 Contar No Leídas
- **Endpoint**: `GET /notificaciones-usuario/no-leidas/contar`
- **Descripción**: Obtiene el número de notificaciones no leídas
- **Autenticación**: Requerida (JWT)

---

### 6. Reportes

#### 6.1 Crear Reporte
- **Endpoint**: `POST /reportes`
- **Descripción**: Crea un nuevo reporte
- **Autenticación**: Requerida (JWT)

#### 6.2 Listar Reportes
- **Endpoint**: `GET /reportes`
- **Descripción**: Obtiene todos los reportes del usuario
- **Autenticación**: Requerida (JWT)

---

## Ejemplos de Solicitud y Respuesta

### 1. Autenticación - Login

#### Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "contrasenia": "password123"
}
```

#### Response (200 OK)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "usuario@ejemplo.com",
    "usuario": "juanperez",
    "telefono": "0987654321",
    "peso": 75.5,
    "altura": 1.75,
    "rol": "USUARIO"
  }
}
```

#### Response (401 Unauthorized)
```json
{
  "timestamp": "2026-02-01T18:30:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Credenciales incorrectas",
  "path": "/api/auth/login"
}
```

---

### 2. Registro de Usuario

#### Request
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "María",
  "apellido": "González",
  "correo": "maria@ejemplo.com",
  "usuario": "mariag",
  "contrasenia": "password123",
  "telefono": "0998877665",
  "peso": 65.0,
  "altura": 1.65,
  "rol": "USUARIO"
}
```

#### Response (201 Created)
```json
{
  "id": 2,
  "nombre": "María",
  "apellido": "González",
  "correo": "maria@ejemplo.com",
  "usuario": "mariag",
  "telefono": "0998877665",
  "peso": 65.0,
  "altura": 1.65,
  "rol": "USUARIO"
}
```

#### Response (409 Conflict)
```json
{
  "timestamp": "2026-02-01T18:30:00.000+00:00",
  "status": 409,
  "error": "Conflict",
  "message": "El correo o usuario ya está registrado",
  "path": "/api/auth/register"
}
```

---

### 3. Actualizar Perfil de Usuario

#### Request
```http
PUT /api/usuarios?email=usuario@ejemplo.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez García",
  "telefono": "0987654321",
  "peso": 76.0,
  "altura": 1.75
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez García",
  "correo": "usuario@ejemplo.com",
  "usuario": "juanperez",
  "telefono": "0987654321",
  "peso": 76.0,
  "altura": 1.75,
  "rol": "USUARIO"
}
```

#### Response (404 Not Found)
```json
{
  "timestamp": "2026-02-01T18:30:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Usuario no encontrado",
  "path": "/api/usuarios"
}
```

---

### 4. Listar Ejercicios

#### Request
```http
GET /api/ejercicios
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "nombre": "Press de Banca",
    "descripcion": "Ejercicio compuesto para pecho",
    "musculoTrabajado": "PECHO",
    "dificultad": "INTERMEDIO",
    "equipo": "Barra y discos",
    "imagen": "https://ejemplo.com/press-banca.jpg"
  },
  {
    "id": 2,
    "nombre": "Sentadilla",
    "descripcion": "Ejercicio compuesto para piernas",
    "musculoTrabajado": "PIERNAS",
    "dificultad": "INTERMEDIO",
    "equipo": "Barra y discos",
    "imagen": "https://ejemplo.com/sentadilla.jpg"
  }
]
```

---

### 5. Listar Rutinas del Usuario

#### Request
```http
GET /api/rutinas-usuario
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "series": 4,
    "repeticiones": 12,
    "peso": 60.0,
    "dia": "LUNES",
    "completado": false,
    "notas": "Aumentar peso la próxima semana",
    "ejercicio": {
      "id": 1,
      "nombre": "Press de Banca",
      "musculoTrabajado": "PECHO",
      "dificultad": "INTERMEDIO"
    },
    "usuario": {
      "id": 1,
      "nombre": "Juan",
      "correo": "usuario@ejemplo.com"
    }
  },
  {
    "id": 2,
    "series": 3,
    "repeticiones": 15,
    "peso": 80.0,
    "dia": "LUNES",
    "completado": true,
    "notas": null,
    "ejercicio": {
      "id": 2,
      "nombre": "Sentadilla",
      "musculoTrabajado": "PIERNAS",
      "dificultad": "INTERMEDIO"
    },
    "usuario": {
      "id": 1,
      "nombre": "Juan",
      "correo": "usuario@ejemplo.com"
    }
  }
]
```

---

### 6. Crear Rutina

#### Request
```http
POST /api/rutinas-usuario
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "ejercicioId": 1,
  "usuarioId": 1,
  "series": 4,
  "repeticiones": 12,
  "peso": 60.0,
  "dia": "LUNES",
  "completado": false,
  "notas": "Primera vez con este peso"
}
```

#### Response (201 Created)
```json
{
  "id": 3,
  "series": 4,
  "repeticiones": 12,
  "peso": 60.0,
  "dia": "LUNES",
  "completado": false,
  "notas": "Primera vez con este peso",
  "ejercicio": {
    "id": 1,
    "nombre": "Press de Banca",
    "musculoTrabajado": "PECHO"
  },
  "usuario": {
    "id": 1,
    "nombre": "Juan",
    "correo": "usuario@ejemplo.com"
  }
}
```

---

### 7. Completar Rutina (Toggle)

#### Request
```http
PUT /api/rutinas-usuario/1/completar
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "id": 1,
  "series": 4,
  "repeticiones": 12,
  "peso": 60.0,
  "dia": "LUNES",
  "completado": true,
  "notas": "Aumentar peso la próxima semana",
  "ejercicio": {
    "id": 1,
    "nombre": "Press de Banca",
    "musculoTrabajado": "PECHO"
  }
}
```

---

### 8. Actualizar Rutina

#### Request
```http
PUT /api/rutinas-usuario/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "series": 5,
  "repeticiones": 10,
  "peso": 65.0,
  "notas": "Peso incrementado exitosamente"
}
```

#### Response (200 OK)
```json
{
  "id": 1,
  "series": 5,
  "repeticiones": 10,
  "peso": 65.0,
  "dia": "LUNES",
  "completado": false,
  "notas": "Peso incrementado exitosamente",
  "ejercicio": {
    "id": 1,
    "nombre": "Press de Banca",
    "musculoTrabajado": "PECHO"
  }
}
```

---

### 9. Listar Notificaciones

#### Request
```http
GET /api/notificaciones-usuario
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
[
  {
    "id": 1,
    "titulo": "Nueva rutina agregada",
    "mensaje": "Se ha agregado Press de Banca a tu rutina de Lunes",
    "leida": false,
    "fecha": "2026-02-01T10:30:00",
    "tipo": "INFO",
    "usuario": {
      "id": 1,
      "nombre": "Juan"
    }
  },
  {
    "id": 2,
    "titulo": "¡Felicitaciones!",
    "mensaje": "Has completado tu rutina de hoy",
    "leida": true,
    "fecha": "2026-01-31T18:45:00",
    "tipo": "SUCCESS",
    "usuario": {
      "id": 1,
      "nombre": "Juan"
    }
  }
]
```

---

### 10. Contar Notificaciones No Leídas

#### Request
```http
GET /api/notificaciones-usuario/no-leidas/contar
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "count": 3
}
```

---

## Manejo de Errores

### Estrategia de Manejo de Errores

La aplicación implementa un sistema robusto de manejo de errores en múltiples capas:

#### 1. Interceptor de Axios (API Client)

**Ubicación**: `src/core/api/apiClient.ts`

```typescript
// Interceptor de respuesta para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      // Redirigir al login
    }
    return Promise.reject(error);
  }
);
```

#### 2. Context API (AuthContext)

**Ubicación**: `src/presentation/context/AuthContext.tsx`

```typescript
const login = async (correo: string, contrasenia: string) => {
  try {
    const response = await authRepository.login(correo, contrasenia);
    // ... proceso de login
  } catch (error: any) {
    // Manejo específico por código de error
    if (error.response?.status === 401) {
      throw new Error('Credenciales incorrectas. Verifica tu correo y contraseña.');
    } else if (error.response?.status === 404) {
      throw new Error('Usuario no encontrado. ¿Ya te has registrado?');
    } else if (error.response?.status === 403) {
      throw new Error('Acceso denegado. Tu cuenta puede estar inactiva.');
    } else if (error.response?.status === 500) {
      throw new Error('Error en el servidor. Inténtalo más tarde.');
    } else {
      throw new Error('Error al iniciar sesión');
    }
  }
};
```

#### 3. Custom Hooks

**Ubicación**: `src/presentation/hooks/useRoutines.ts`

```typescript
const completeRoutine = async (id: number) => {
  try {
    setLoading(true);
    const updated = await routineRepository.completeRoutine(id);
    
    // Actualizar estado local
    setRoutines(routines.map(r => 
      r.id === id ? updated : r
    ));
    
    return updated;
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || 
                        err.message || 
                        'Error al actualizar rutina';
    setError(errorMessage);
    throw err;
  } finally {
    setLoading(false);
  }
};
```

#### 4. Pantallas (UI Layer)

**Ubicación**: `src/presentation/screens/auth/LoginScreen.tsx`

```typescript
const handleLogin = async () => {
  try {
    setLoading(true);
    await login(formData.correo, formData.contrasenia);
    router.replace('/(main)/home');
  } catch (error: any) {
    Alert.alert(
      'Error al iniciar sesión',
      error.message || 'Error al iniciar sesión',
      [{ text: 'OK' }]
    );
  } finally {
    setLoading(false);
  }
};
```

---

### Códigos de Error HTTP y Manejo

| Código | Descripción | Manejo en la App |
|--------|-------------|------------------|
| **400** | Bad Request | Mensaje: "Datos inválidos. Verifica la información" |
| **401** | Unauthorized | Mensaje: "Credenciales incorrectas" + Limpia sesión |
| **403** | Forbidden | Mensaje: "Sesión expirada" + Redirige a login |
| **404** | Not Found | Mensaje: "Recurso no encontrado" |
| **409** | Conflict | Mensaje: "El correo o usuario ya está registrado" |
| **500** | Server Error | Mensaje: "Error en el servidor. Inténtalo más tarde" |
| **Network Error** | Sin conexión | Mensaje: "No se pudo conectar con el servidor" |

---

### Ejemplos de Errores y Respuestas

#### Error 401 - Credenciales Incorrectas

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com",
  "contrasenia": "wrongpassword"
}
```

**Response:**
```json
{
  "timestamp": "2026-02-01T18:30:00.000+00:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Credenciales incorrectas",
  "path": "/api/auth/login"
}
```
---

#### Error 403 - Token Expirado

**Request:**
```http
GET /api/rutinas-usuario
Authorization: Bearer <token_expirado>
```

**Response:**
```json
{
  "timestamp": "2026-02-01T18:30:00.000+00:00",
  "status": 403,
  "error": "Forbidden",
  "message": "Token inválido o expirado",
  "path": "/api/rutinas-usuario"
}
```

---

#### Error 409 - Usuario Duplicado

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "correo": "usuario@ejemplo.com", // Email ya registrado
  "nombre": "Test",
  "contrasenia": "password123"
}
```

**Response:**
```json
{
  "timestamp": "2026-02-01T18:30:00.000+00:00",
  "status": 409,
  "error": "Conflict",
  "message": "El correo ya está registrado",
  "path": "/api/auth/register"
}
```
---

#### Error de Red (Network Error)

**Escenario:** Sin conexión a internet o servidor no disponible


**Código:**
```typescript
catch (error: any) {
  if (!error.response) {
    // Error de red
    Alert.alert(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
    );
  }
}
```

---

#### Validación de Formularios

**Ejemplo: Registro con campos vacíos**

```typescript
const validateForm = (): boolean => {
  const newErrors = {
    nombre: '',
    correo: '',
    contrasenia: ''
  };

  if (!formData.nombre.trim()) {
    newErrors.nombre = 'El nombre es obligatorio';
    isValid = false;
  }

  if (!formData.correo.trim()) {
    newErrors.correo = 'El correo electrónico es obligatorio';
    isValid = false;
  } else if (!validateEmail(formData.correo)) {
    newErrors.correo = 'Por favor ingresa un correo válido';
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
};
```

### Logs de Errores (Solo en Desarrollo)

Los logs están deshabilitados en producción para evitar exponer información sensible:

```typescript
// apiClient.ts
if (__DEV__) {
  console.log('Request:', config);
  console.error('Error:', error);
}
```

---

## ⚙️ Configuración

### Variables de Entorno

#### Desarrollo
```env
API_BASE_URL=http://192.168.1.4:8081
API_TIMEOUT=30000
ENABLE_LOGS=true
NODE_ENV=development
```
---

### Configuración del Cliente HTTP

**Ubicación**: `src/core/api/apiClient.ts`

```typescript
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://192.168.1.4:8081',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Agrega el token a cada petición
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor - Maneja errores globales
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userData');
      // Redirigir a login
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await api.get<T>(url);
    return response.data;
  },
  
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },
  
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },
  
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};
```

---

### Storage de Autenticación

**Ubicación**: Expo SecureStore

```typescript
// Guardar token
await SecureStore.setItemAsync('userToken', token);

// Guardar datos del usuario
await SecureStore.setItemAsync('userData', JSON.stringify(userData));

// Leer token
const token = await SecureStore.getItemAsync('userToken');

// Leer datos del usuario
const userDataStr = await SecureStore.getItemAsync('userData');
const userData = JSON.parse(userDataStr);

// Eliminar al cerrar sesión
await SecureStore.deleteItemAsync('userToken');
await SecureStore.deleteItemAsync('userData');
```

---

## Instalación y Ejecución

### Requisitos Previos
- Node.js v18 o superior
- npm o yarn
- Expo CLI
- Android Studio (para Android) o Xcode (para iOS)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/fitsil-mobile.git

# Navegar al directorio
cd fitsil-mobile

# Instalar dependencias
npm install

# Iniciar el proyecto
npx expo start
```

### Ejecutar en Dispositivo

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios

# Web (desarrollo)
npx expo start --web
```

---

## Dependencias Principales

```json
{
  "dependencies": {
    "expo": "~52.0.21",
    "expo-router": "~4.0.14",
    "react": "18.3.1",
    "react-native": "0.76.5",
    "axios": "^1.7.9",
    "expo-secure-store": "~14.0.0",
    "@expo/vector-icons": "^14.0.4"
  }
}
```

