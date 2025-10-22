# Sistema-FitSIL
SIL- Santiago, Isabel, Leonardo
Aplicación para la gestión de rutinas de entrenamiento, registro de progreso y seguimiento fitness.

El sistema está diseñado con arquitectura de **microservicios**, usando **Java + Spring Boot** para el backend principal y **Python** para servicios especializados (ej. cálculos, estadísticas o IA).

------- Arquitectura Seleccionada----------
El proyecto sigue una **arquitectura de microservicios**:
- **API Gateway**: expone los servicios al frontend.
- **Backend (Java, Spring Boot)**:  
  - Gestión de usuarios.  
  - Rutinas y ejercicios.  
  - Autenticación (JWT).  
- **Microservicio en Python**:  
  - Procesamiento de datos (ej. estadísticas de progreso).  
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


---Flujo de Trabajo con GitFlow-----
- **main** → rama de producción.  
- **develop** → rama de integración de features.  
- **feature/*** → ramas para nuevas funcionalidades (`feature/login`, `feature/dashboard`, feature/Espinoza, feature/Jimenez, feature/Morocho).

