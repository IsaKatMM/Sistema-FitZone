# Mini Dossier Técnico - API REST FitSIL
**Herramienta de Documentación:** Postman

---

## Microservicio 1: Gestión de usuarios
**Descripción:** Registra y autentica a los usuarios del sistema.

### Endpoints Usuarios

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|------------|------------|------------------|--------------------|--------------------|
| `/usuarios/registro` | POST | Registro de usuario | JSON con datos del usuario | 201 Created | 
```json
{
  "id": 3,
  "nombre": "Jose",
  "apellido": "Morocho",
  "correo": "JOSE@example.com",
  "usuario": "JoseMM",
  "contrasenia": 12536,
  "peso": 60.0,
  "altura": 1.65
}
``` | 
```json
{"mensaje":"Usuario registrado correctamente","id":3}
``` |
| `/usuarios/login` | POST | Iniciar sesión | JSON con usuario y contraseña | 200 OK | 
```json
{
  "correo": "JOSE@example.com",
  "contrasenia": 12536
}
``` |
```json
{"token":"jwt_generado"}
``` |
| `/usuarios/perfil` | PUT | Actualiza los datos del usuario | email (query param) | 200 OK | 
```json
{
  "nombre": "Jose",
  "correo": "JOSE@example.com",
  "peso": 76.0,
  "altura": 1.80
}
``` |
```json
{"mensaje":"Usuario actualizado correctamente"}
``` |
| `/usuarios/perfil` | DELETE | Elimina un usuario existente | email (query param, obligatorio) | 200 OK | `/usuarios/perfil?email=jose@example.com` | `Usuario eliminado: JOSE@example.com` |

---

### Endpoints Administrador

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|------------|------------|------------------|--------------------|--------------------|
| `/administradores/registro` | POST | Crea un nuevo administrador | JSON con datos del admin | 200 OK | 
```json
{
  "nombre": "Admin1",
  "correo": "admin1@example.com",
  "departamento": "TI",
  "codigoAdmin": 101,
  "password": "1234"
}
``` |
```json
{"mensaje":"Administrador creado correctamente","id":1}
``` |
| `/administradores/perfil` | PUT | Actualiza administrador | email (query param, obligatorio) | 200 OK | 
```json
{
  "departamento": "RRHH",
  "codigoAdmin": 102
}
``` |
```json
{
  "id": null,
  "nombre": "Admin1",
  "apellido": null,
  "telefono": null,
  "correo": "admin1@example.com",
  "usuario": null,
  "contrasenia": null,
  "rol": "ADMINISTRADOR",
  "departamento": "RRHH",
  "codigoAdmin": 102
}
``` |
| `/administradores/perfil` | DELETE | Elimina un administrador | email (query param, obligatorio) | 200 OK | `/administradores/perfil?email=admin1@example.com` | `Administrador eliminado: admin1@example.com` |
| `/administradores/usuarios` | GET | Lista todos los usuarios registrados (solo admin) | — | 200 OK | — | Lista de usuarios |
| `/administradores/usuarios/rol?email=` | PUT | Cambia el rol de un usuario | email (query param, obligatorio) | 200 OK | 
```json
{"rol": "ADMINISTRADOR"}
``` |
```json
{"mensaje":"Rol actualizado correctamente"}
``` |

---

## Microservicio 2: Gestión de ejercicios
**Descripción:** Registra y muestra los ejercicios.

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|------------|------------|------------------|--------------------|--------------------|
| `/ejercicios/obtener` | GET | Muestra lista de ejercicios guardados | JSON con datos del ejercicio | 200 OK | 
```json
{
  "nombre": "press inclinado",
  "descripcion": "Ejercicio para pecho",
  "musculoTrabajado": "pecho superior"
}
``` |
```json
{
  "id": 1,
  "nombre": "press inclinado",
  "descripcion": "Ejercicio para pecho",
  "musculoTrabajado": "pecho superior"
}
``` |
| `/ejercicios/guardar` | POST | Guarda información de ejercicios | — | 200 OK | — | Lista de usuarios |

---

## Microservicio 3: Estadísticas y Reportes
**Descripción:** Informa a los usuarios sobre sus progresos, rendimiento y avances.

| Ruta | Método | Descripción | Parámetros | Código de respuesta | Ejemplo de solicitud | Ejemplo de respuesta |
|------|--------|------------|------------|------------------|--------------------|--------------------|
| `/api/estadisticas` | GET | Muestra información del usuario y su progreso | JSON con métricas | 200 OK | — |
```json
{
  "idUsuario": "U003",
  "fecha": "2020-9-4",
  "caloriasQuemadas": 140.6,
  "minutosEjercicio": 15,
  "nivelEstres": 1.0
}
``` |
| `/api/estadisticas` | POST | Guarda información del usuario y progreso | — | 200 OK | 
```json
{
  "idUsuario": "U004",
  "fecha": "2021-9-5",
  "caloriasQuemadas": 170.6,
  "minutosEjercicio": 60,
  "nivelEstres": 3.6
}
``` | `Estadística registrada correctamente` |

---

## Anexos

### Microservicio 1
- Usuario: POST, PUT, DELETE  
- Administrador: POST, PUT, DELETE, GET, PUT

### Microservicio 2
- POST, GET

### Microservicio 3
- GET, POST
