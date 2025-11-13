# Sistema FitSIL - Documentación del Proyecto

## Descripción General
FitSIL (Santiago, Isabel, Leonardo) es una aplicación completa para la gestión de rutinas de entrenamiento, registro de progreso y seguimiento fitness.  
El sistema permite a los usuarios crear rutinas personalizadas, realizar seguimiento de ejercicios, visualizar estadísticas de rendimiento y gestionar su perfil de manera segura.  

El sistema está diseñado con arquitectura modular, donde cada módulo gestiona una funcionalidad específica del sistema (usuarios, rutinas, autenticación, estadísticas, etc.).  
El backend principal se desarrolla con **Java + Spring Boot**, y se proyecta integrar un microservicio adicional que se encargue de recomendar planes nutricionales para los usuarios.

---

## Arquitectura del Sistema

### Arquitectura Modular Adoptada
El proyecto sigue una arquitectura modular dividida en los siguientes componentes:

### Backend (Java + Spring Boot)
#### 1. Módulo de Gestión de Usuarios
- Registro y autenticación de usuarios y administradores  
- Gestión de perfiles (actualización, eliminación)  
- Control de roles (USUARIO, ADMINISTRADOR)  
- Validación de datos con Bean Validation  
- Sanitización de entradas para prevenir inyecciones  

#### 2. Módulo de Gestión de Ejercicios
- CRUD de ejercicios (solo administradores pueden crear)  
- Búsqueda y listado de ejercicios  
- Información detallada: nombre, descripción, músculos trabajados  

#### 3. Módulo de Rutina Semanal
- Conexión entre usuarios y ejercicios  
- Planificación semanal (día específico para cada ejercicio)  
- Registro de series, repeticiones y peso  
- Marcado de rutinas completadas  
- Seguimiento del progreso semanal  

#### 4. Módulo de Autenticación y Seguridad (JWT)
- Generación y validación de tokens JWT  
- Control de acceso basado en roles (RBAC)  
- Filtros de seguridad personalizados  
- Protección contra intentos de acceso no autorizado  

#### 5. Módulo de Estadísticas y Reportes
- Generación automática de estadísticas por sesión  
- Cálculo de calorías quemadas  
- Nivel de estrés estimado  
- Promedios y métricas de rendimiento  
- Historial de entrenamientos  

### Microservicio (Proyectado)
- Planes nutricionales personalizados para usuarios  
- Posible módulo de Machine Learning para recomendaciones inteligentes  

### Base de Datos
- MySQL para persistencia de datos  

### Frontend (Proyectado)
- Web (JS/HTML/CSS)  
- App móvil (React Native)

---

## Módulo de Seguridad

### Características Implementadas
#### 1. Autenticación JWT
- Endpoints `/auth/login` y `/usuarios/registro`  
- Tokens JWT con campos `exp`, `iat` y `roles`  
- Validación de credenciales con BCrypt  
- Protección contra fuerza bruta (máximo 5 intentos fallidos)  

#### 2. Control de Acceso Basado en Roles (RBAC)
**Roles disponibles:**  
- USUARIO: Acceso a funcionalidades básicas (perfil, rutinas, estadísticas propias)  
- ADMINISTRADOR: Acceso total (gestión de usuarios, ejercicios, estadísticas globales)  

**Filtros de seguridad:**  
- JwtAuthFilter: Valida tokens JWT en cada petición  
- RoleFilter: Restringe acceso según el rol del usuario  

#### 3. Configuración CORS
- Política configurada para permitir solicitudes desde dominios autorizados  
- Headers personalizados para seguridad adicional  

#### 4. Validación y Sanitización
- Validación con Bean Validation (`@NotBlank`, `@Email`, `@Size`, `@Pattern`)  
- Sanitización de entradas para prevenir XSS e inyección SQL  
- Clase `Sanitizer` para limpiar datos de entrada  

#### 5. Principios OWASP Top 10
- Protección contra inyecciones (SQL, XSS)  
- Gestión segura de contraseñas (BCrypt)  
- Control de acceso robusto  
- Manejo centralizado de errores con `GlobalExceptionHandler`  
- Logging de eventos de seguridad  

---

## Módulos del Sistema

### 1. Módulo de Gestión de Usuarios
**Entidades:**
- `Persona` (clase base con herencia JOINED)  
- `Usuario` (extiende Persona, incluye peso y altura)  
- `Administrador` (extiende Persona, incluye departamento y código)  

**Funcionalidades:**
- Registro de usuarios con validación  
- Login con control de intentos fallidos  
- Actualización de perfil (nombre, apellido, teléfono, peso, altura)  
- Eliminación de cuenta  
- Estadísticas globales (promedio de peso y altura)  
- Cambio de roles (solo administradores)  

**Endpoints principales:**
- `POST /usuarios/registro`  
- `POST /usuarios/login`  
- `GET /usuarios/perfil/{email}`  
- `PUT /usuarios/perfil?email={email}`  
- `DELETE /usuarios/perfil?email={email}`  

---

### 2. Módulo de Gestión de Ejercicios
**Entidad:**
- `Ejercicio` (id, nombre, descripción, músculoTrabajado)  

**Funcionalidades:**
- Crear ejercicios (solo administradores)  
- Listar todos los ejercicios  
- Buscar ejercicios por nombre  

**Endpoints principales:**
- `POST /ejercicios/guardar` (requiere rol ADMINISTRADOR)  
- `GET /ejercicios/obtener`  
- `GET /ejercicios/buscar?nombre={nombre}`  

---

### 3. Módulo de Rutina Semanal
**Entidades:**
- `RutinaSemanal` (conexión Usuario-Ejercicio con planificación)  
- `DiaSemana` (enum: LUNES, MARTES, ..., DOMINGO)  

**Funcionalidades:**
- Agregar ejercicios a la rutina semanal  
- Asignar día específico para cada ejercicio  
- Registrar series, repeticiones y peso  
- Marcar rutinas como completadas  
- Actualizar rutinas existentes  
- Eliminar rutinas individuales o todas las del usuario  
- Obtener rutinas por día específico  
- Estadísticas de completitud (% de rutinas completadas)  

---

### 4. Módulo de Estadísticas y Reportes
**Entidad:**  
- `Estadistica` (usuario, fecha, calorías quemadas, minutos de ejercicio, nivel de estrés)  

**Funcionalidades:**
- Generación automática de estadísticas  
- Cálculo de calorías quemadas: `minutos × peso × 0.05`  
- Estimación de nivel de estrés: `100 - (minutos × 2)`  
- Historial de estadísticas por usuario  
- Promedio de nivel de estrés  

**Endpoints principales:**
- `GET /api/estadisticas`  
- `POST /api/estadisticas/generar?email={email}&minutos={minutos}`  
- `GET /api/estadisticas/usuario/{email}`  
- `GET /api/estadisticas/promedio-estres/{email}`  

---

### 5. Módulo de Administración
**Funcionalidades:**
- Registro de administradores (primer admin sin token, siguientes requieren autenticación)  
- Actualización de perfil de administrador  
- Eliminación de administradores  
- Listar todos los usuarios del sistema  
- Cambiar roles de usuarios  
- Consultar estadísticas globales  

**Endpoints principales:**
- `POST /administradores/registro`  
- `PUT /administradores/perfil?email={email}`  
- `DELETE /administradores/perfil?email={email}`  
- `GET /administradores/usuarios`  
- `PUT /administradores/usuarios/rol?email={email}`  
- `GET /administradores/usuarios/estadísticas`  

---
## Documentación de API - Endpoints Detallados

### (Gestión de usuarios)
**Descripción:** Registra y autentica a los usuarios del sistema.  
**Endpoints usuarios**

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|-------------|------------|---------------------|----------------------|----------------------|
| http://localhost:8081/usuarios/registro | POST | Registro de usuario | JSON con datos del usuario | 201 Created | `{"nombre":"Jose","apellido":"Morocho","telefono":"+593...","correo":"JOSE@example.com","usuario":"JoseAMM","contraseña":"12536","peso":60.0,"altura":1.65}` | `{"mensaje":"Usuario registrado correctamente","id":3}` |
| http://localhost:8081/usuarios/login | POST | Iniciar Sesión | JSON con usuario y contraseña | 200 OK | `{"correo":"JoseAMM@example.com","contraseña":"..."}` | `{"token":"jwt_ge_nerado"}` |
| http://localhost:8081/usuarios/perfil | PUT | Actualiza los datos del usuario. | email (query param) → usuario a actualizar | 200 OK | `{"nombre":"Jose","correo":"Jose@example.com","peso":76.0,"altura":1.80}` | `{"mensaje":"Usuario actualizado correctamente"}` |
| http://localhost:8081/usuarios/perfil | DELETE | Elimina un usuario del archivo JSON. Solo elimina el archivo. JSON corresponde al correo del usuario a eliminar | email (query param, obligatorio) | 200 OK | http://localhost:8081/usuarios/perfil?email=JOSE@example.com | Usuario eliminado. JOSE@example.com |

**Endpoints administrador**

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|-------------|------------|---------------------|----------------------|----------------------|
| http://localhost:8081/administradores/registro | POST | Crea un nuevo administrador | JSON con datos del admin | 200 Ok | `{"nombre":"Admin1","apellido":"...","correo":"admin1@ex...","departamento":"IT","codigoAdmin":"101","password":"1234"}` | `{"mensaje":"Administrador creado correctamente","id":3}` |
| http://localhost:8081/administradores/perfil | PUT | Actualizar administrador | email (query param, obligatorio) | 200 OK | `{"id":null,"nombre":"Admin","apellido":null,"telefono":null,"correo":"admin@example.com","usuario":null,"contraseña":null,"rol":"ADMINISTRADOR","departamento":"RRHH","codigoAdmin":"102"}` | `{"mensaje":"Administrador actualizado correctamente"}` |
| http://localhost:8081/administradores/perfil | DELETE | Elimina un administrador del archivo JSON | email (query param, obligatorio) | 200 OK | http://localhost:8081/administradores/perfil?email=admin1@example.com | Administrador admin1@exam... |
| http://localhost:8081/administradores/usuarios | GET | Lista todos los usuarios registrados (solo admin). | - | 200 OK | - | Lista de usuarios |
| http://localhost:8081/administradores/usuarios/rol?email=usu | PUT | Cambia el rol de un usuario. | email (query param, obligatorio) | 200 OK | `{"rol":"ADMINISTRADOR"}` | `{"mensaje":"Rol actualizado correctamente"}` |

---

### (Gestión de ejercicios)
**Descripción:** Registra y muestra los ejercicios

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|-------------|------------|---------------------|----------------------|----------------------|
| http://localhost:8081/ejercicios | Get | Muestra la lista de los ejercicios que se han guardado en la aplicación con sus atributos (nombre, descripción y el músculo o parte del cuerpo que trabaja). | JSON con datos del ejercicio | 200 Ok | `{"nombre":"press banca","descripcion":"Ejercicio para pecho","musculoTrabajado":"pecho superior"}` | `{"id":"1","nombre":"press banca","descripcion":"Ejercicio para pecho","musculoTrabajado":"pecho superior"}` |
| http://localhost:8081/ejercicios/guardar | Post | Permite guardar la información de los ejercicios (nombre, descripción y el músculo o parte del cuerpo que se trabaja). | - | 200 Ok | - | Lista de usuarios |

---

### (Estadísticas y Reportes)
**Descripción:** Informa a los usuarios sus progresos, rendimiento y avances de sus rutinas.

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|-------------|------------|---------------------|----------------------|----------------------|
| http://localhost:8081/api/estadisticas | Get | Muestra información sobre el usuario y su progreso (id, fecha, calorías quemadas, minutos de ejercicio, niveles de estrés). | Json con la información de las métricas y estadísticas | 200 Ok | - | `{"idUsuario":"U003","fecha":"2020-4-4","caloriasQuemadas":140.6}` |
| http://localhost:8081/api/estadisticas | Post | Permite guardar información del usuario junto a su respectivo nivel de progreso | - | 200 Ok | `{"idUsuario":"U004","fecha":"2021-9-5","caloriasQuemadas":170.6,"minutosEjercicio":60,"nivelEstres":3.6}` | Estadística registrada correctamente |



## Flujo de Trabajo con GitFlow

### Ramas Principales
- `main` → Rama de producción (código estable)  
- `develop` → Rama de integración de features  

### Ramas de Features
- `feature/Espinoza` → Módulo de rutinas  
- `feature/Jimenez` → Módulo de ejercicios  
- `feature/Morocho` → Módulo de estadísticas  

