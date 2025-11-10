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
  - Módulo de Rutina Semanal (Conexion de usuarios con ejercicios para que cada usuario pueda crear sus rutinas)
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

