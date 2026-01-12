# Sistema-FitSIL
FitSIL (Santiago, Isabel, Leonardo)=SIL
SIL- Santiago, Isabel, Leonardo
origin/develop
Aplicación para la gestión de rutinas de entrenamiento, registro de progreso y seguimiento fitness.

El sistema está diseñado con arquitectura modular, donde cada módulo gestiona una funcionalidad específica del sistema (usuarios, rutinas, autenticación, estadísticas, etc.).
El backend principal se desarrolla con Java + Spring Boot, y se proyecta integrar un microservicio adicional que se encarge de recomendar planes nutricionales para los usuarios.

------- Arquitectura Seleccionada----------
El proyecto sigue una **arquitectura modular**:
- **Backend (Java, Spring Boot)**:  
  - Módulo de gestión de usuarios.  
  - Módulo de rutinas y ejercicios.  
  - Módulo de autenticación (JWT).
  - Módulo de estadísticas (procesamiento de datos y reportes)
- **Microservicio**:  
  - Planes nutricionales para los usuarios 
  - Posible módulo de Machine Learning para recomendaciones.  
- **Base de datos**: MySQL.  
- **Frontend**: Web (JS/HTML/CSS) y App móvil (React Native).  

-------- Estándares de Codificación Adoptados--------

- Mantener un estilo de código **claro, legible y consistente** en todo el proyecto.  
- Usar **convenciones de nombres**:
  - Clases y componentes → nombres descriptivos en PascalCase.
  - Variables y métodos/funciones → nombres claros en camelCase o snake_case según el lenguaje.
- **Indentación uniforme** (4 espacios recomendados).  
- **Comentarios y documentación** solo donde sea necesario, priorizando un código autoexplicativo.  
- Organización del código siguiendo la **arquitectura definida** (separar controladores, servicios, repositorios, etc.).  
- Uso de **mensajes de commit claros y descriptivos** para facilitar el historial de cambios.  
- Aplicación de **buenas prácticas de programación**: modularidad, reutilización de código y pruebas unitarias para funciones críticas.

---------Módulo de Seguridad (JWT / CORS / OWASP)---------

Objetivo:
Implementar autenticación y autorización seguras en el backend mediante JWT, validación de roles (RBAC), políticas CORS y principios del OWASP Top 10.

Características implementadas:
- Creación de rutas /auth/login y /auth/register.
- Generación de tokens JWT con campos exp, iat y roles.
- Filtro de roles (RoleFilter) para restringir acceso a endpoints según el tipo de usuario (ADMIN / USUARIO).
- Configuración CORS para permitir solicitudes solo desde el dominio autorizado
- Validación de datos con Bean Validation (@NotBlank, @Email, @Size, etc.).
- Manejo global de errores mediante la clase GlobalExceptionHandler.
- Actualización de los diagramas C4 (Contenedores y Componentes) para incluir módulos de autenticación y seguridad.
- Pruebas con Postman/Swagger evidenciando respuestas 200, 401, 403 según los casos.

Resultados:
- Backend con autenticación funcional usando JWT.
- Rutas protegidas verificadas con tokens válidos/expirados.
- Código organizado según estándares OWASP y GitFlow.


---Flujo de Trabajo con GitFlow-----
- **main** → rama de producción.  
- **develop** → rama de integración de features.  
- **feature/*** → ramas para nuevas funcionalidades (`feature/login`, `feature/dashboard`, feature/Espinoza, feature/Jimenez, feature/Morocho).



--- Unidad 2--- 
Sistema integral de gestión de gimnasios que permite administrar usuarios, rutinas de ejercicios y estadísticas de entrenamiento. Desarrollado con una arquitectura modular y escalable.

##  Descripción General
FitSIL es un sistema completo para la gestión de gimnasios que facilita el seguimiento del progreso de los usuarios, la planificación de rutinas de ejercicios personalizadas y el análisis de estadísticas de rendimiento. El sistema está diseñado para ser utilizado tanto por entrenadores como por usuarios finales.

### Características Principales

- Gestión completa de usuarios y perfiles
- Catálogo extenso de ejercicios y rutinas
- Seguimiento de progreso y estadísticas
- Panel de administración intuitivo
- API RESTful documentada
-  Autenticación y autorización segura

## Tecnologías

### Backend
- **SpringBoot** - Backend Funcional
- **JWT** - Autenticación mediante tokens
- **bcrypt** - Encriptación de contraseñas

### Frontend
- **React** - Biblioteca de interfaz de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS** - Framework de estilos
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP

##  Arquitectura del Sistema

El sistema sigue una arquitectura modular MVC (Model-View-Controller) organizada en los siguientes componentes:

```
Sistema-FitZone/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── usuarios/
│   │   │   ├── ejercicios/
│   │   │   └── estadisticas/
│   │   ├── config/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

## Módulos

### Módulo de Usuarios

El módulo de usuarios gestiona toda la información relacionada con los miembros del gimnasio, incluyendo registro, autenticación y perfiles de usuario.

#### Características

- **Registro y Autenticación**: Sistema seguro de registro e inicio de sesión con encriptación de contraseñas
- **Gestión de Perfiles**: Información personal, datos antropométricos y objetivos de entrenamiento
- **Roles y Permisos**: Sistema de roles (Admin, Entrenador, Usuario) con permisos diferenciados
- **Membresías**: Control de planes de suscripción y estados de membresía
- **Historial**: Seguimiento completo de la actividad del usuario



### Módulo de Ejercicios

El módulo de ejercicios proporciona un catálogo completo de ejercicios y permite la creación y gestión de rutinas de entrenamiento personalizadas.

#### Características

- **Catálogo de Ejercicios**: Base de datos con ejercicios clasificados por grupo muscular y tipo
- **Rutinas Personalizadas**: Creación de rutinas adaptadas a objetivos específicos
- **Instrucciones Detalladas**: Descripciones, técnicas y recomendaciones para cada ejercicio
- **Multimedia**: Soporte para imágenes y videos demostrativos
- **Planificación**: Sistema de programación de entrenamientos semanales
- **Seguimiento**: Registro de series, repeticiones y pesos utilizados



### Módulo de Estadísticas

El módulo de estadísticas proporciona análisis detallados del progreso y rendimiento de los usuarios, generando métricas y visualizaciones útiles para la toma de decisiones.

#### Características

- **Progreso de Entrenamiento**: Seguimiento de entrenamientos completados y consistencia
- **Evolución Física**: Gráficos de cambios en peso, medidas y composición corporal
- **Rendimiento por Ejercicio**: Análisis de mejoras en fuerza y resistencia
- **Objetivos y Metas**: Visualización del avance hacia objetivos establecidos
- **Reportes Periódicos**: Informes semanales, mensuales y anuales
- **Comparativas**: Análisis de rendimiento a lo largo del tiempo
- **Dashboards Interactivos**: Visualización gráfica de todas las métricas


#### Métricas Calculadas

- **Asistencia**: Porcentaje de entrenamientos completados
- **Volumen de Entrenamiento**: Total de peso levantado
- **Calorías Quemadas**: Estimación de gasto calórico
- **Fuerza Relativa**: Progresión en ejercicios clave
- **Índice de Progreso**: Métrica compuesta de mejora general
- **Consistencia**: Frecuencia y regularidad de entrenamientos



##  FRONTEND

El frontend del sistema está desarrollado con React y TypeScript, proporcionando una interfaz moderna, responsiva e intuitiva para usuarios y administradores.

### Características del Frontend

- **Dashboard Personalizado**: Panel de control con métricas en tiempo real
- **Gestión de Rutinas**: Interfaz drag-and-drop para crear y modificar rutinas
- **Calendario de Entrenamientos**: Visualización y planificación de sesiones
- **Gráficos Interactivos**: Visualización de estadísticas con Chart.js
- **Perfiles de Usuario**: Edición completa de datos personales
- **Sistema de Notificaciones**: Recordatorios y alertas
- **Modo Responsivo**: Diseño adaptado a móviles, tablets y desktop
- **Tema Claro/Oscuro**: Personalización de la interfaz

### Estructura del Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizables
│   │   ├── usuarios/        # Componentes de usuario
│   │   ├── ejercicios/      # Componentes de ejercicios
│   │   ├── estadisticas/    # Componentes de estadísticas
│   │   └── layout/          # Layout y navegación
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Perfil.tsx
│   │   ├── Ejercicios.tsx
│   │   ├── Rutinas.tsx
│   │   └── Estadisticas.tsx
│   ├── services/
│   │   ├── api.ts           # Configuración de Axios
│   │   ├── auth.service.ts
│   │   ├── ejercicios.service.ts
│   │   └── estadisticas.service.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useStats.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── utils/
│   │   ├── validators.ts
│   │   └── formatters.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
```

### Páginas Principales

####  Dashboard
Panel principal con resumen de actividad, próximos entrenamientos y métricas clave.

####  Perfil de Usuario
Visualización y edición de información personal, datos antropométricos y objetivos.

#### Catálogo de Ejercicios
Exploración de ejercicios con filtros por grupo muscular, dificultad y equipamiento.

####  Mis Rutinas
Gestión de rutinas personalizadas, creación y seguimiento de programas de entrenamiento.

#### Estadísticas
Visualización de gráficos de progreso, evolución física y análisis de rendimiento.

### Tecnologías Frontend

- **React 18** - Biblioteca principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **React Router DOM** - Enrutamiento
- **Axios** - Peticiones HTTP
- **Chart.js / Recharts** - Gráficos
- **React Hook Form** - Manejo de formularios
- **Zustand / Context API** - Gestión de estado
- **React Query** - Caché y sincronización de datos
- **Framer Motion** - Animaciones

### Scripts Disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run build      # Construye la aplicación para producción
npm test           # Ejecuta los tests
npm run lint       # Ejecuta el linter
```

---

## Instalación

### Prerrequisitos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

### Backend

```bash
# Clonar el repositorio
git clone https://github.com/IsaKatMM/Sistema-FitZone.git
cd Sistema-FitZone/backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Iniciar el servidor
npm run dev
```

### Frontend

```bash
# Ir al directorio frontend
cd ../frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar la aplicación
npm start
```

##  Configuración

### Variables de Entorno - Backend

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitzone
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

### Variables de Entorno - Frontend

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Uso

### Inicio Rápido

1. **Registrar un usuario**: Accede a `/registro` y crea una cuenta
2. **Iniciar sesión**: Usa tus credenciales en `/login`
3. **Explorar ejercicios**: Navega por el catálogo de ejercicios
4. **Crear rutina**: Diseña tu primera rutina de entrenamiento
5. **Registrar entrenamiento**: Completa una sesión y registra tu progreso
6. **Ver estadísticas**: Revisa tus métricas en el dashboard

### Roles de Usuario

- **Usuario**: Acceso a perfil, rutinas propias y estadísticas personales
- **Entrenador**: Puede crear rutinas para usuarios asignados
- **Admin**: Acceso completo al sistema y gestión de usuarios


## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

##  Contacto

**Desarrolladores**: Leonardo Espinoza, Santiago Jimenez, Isabel Morocho

**GitHub**: [https://github.com/IsaKatMM](https://github.com/IsaKatMM)

**Repositorio**: [https://github.com/IsaKatMM/Sistema-FitZone](https://github.com/IsaKatMM/Sistema-FitZone)

---



