package sistema_FitSIL.GestionUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.service.AdministradorService;
import sistema_FitSIL.GestionUsuarios.security.JwtService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/administradores")
@CrossOrigin(origins = "http://localhost:3000")
public class AdministradorController {

    @Autowired
    private AdministradorService adminService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    // 🔐 LOGIN ADMINISTRADOR
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String correo = body.get("correo");
        String contrasenia = body.get("contrasenia");

        if (correo == null || contrasenia == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Correo y contraseña son obligatorios"));
        }

        try {
            Optional<Administrador> logeado = adminService.login(correo, contrasenia);

            if (logeado.isEmpty()) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Credenciales inválidas"));
            }

            Administrador admin = logeado.get();

            // ✅ JWT con rol
            String token = jwtService.generarToken(
                    admin.getCorreo(),
                    admin.getRol().name()
            );

            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("usuario", admin);
            respuesta.put("correo", admin.getCorreo());
            respuesta.put("rol", admin.getRol().name());
            respuesta.put("nombre", admin.getNombre());
            respuesta.put("token", token);

            return ResponseEntity.ok(respuesta);
            
        } catch (Exception e) {
            System.err.println("❌ Error en login admin: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    // ➕ REGISTRAR ADMINISTRADOR
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Administrador admin) {

        try {
            // ✅ Encriptar contraseña
            admin.setContrasenia(
                    passwordEncoder.encode(admin.getContrasenia())
            );

            Administrador nuevoAdmin = adminService.registrarAdmin(admin);
            
            return ResponseEntity.status(201).body(nuevoAdmin);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error en registro admin: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    // ✏️ ACTUALIZAR PERFIL ADMIN
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizar(
            @RequestParam String email,
            @RequestBody Administrador datos) {

        try {
            Administrador actualizado = adminService.actualizarAdmin(email, datos);
            return ResponseEntity.ok(actualizado);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error al actualizar admin: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    // 🗑️ ELIMINAR ADMIN
    @DeleteMapping("/perfil")
    public ResponseEntity<?> eliminar(@RequestParam String email) {

        try {
            adminService.eliminarAdmin(email);
            return ResponseEntity.ok(
                    Map.of("mensaje", "Administrador eliminado", "email", email)
            );
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error al eliminar admin: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    // 👥 LISTAR USUARIOS
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(
                adminService.listarUsuarios()
        );
    }

    // 🔄 CAMBIAR ROL DE USUARIO
    @PutMapping("/usuarios/rol")
    public ResponseEntity<?> cambiarRol(
            @RequestParam String email,
            @RequestBody Usuario datos) {

        try {
            Usuario actualizado = adminService.cambiarRol(
                    email,
                    datos.getRol().name()
            );
            return ResponseEntity.ok(actualizado);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error al cambiar rol: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    // 📊 ESTADÍSTICAS
    @GetMapping("/usuarios/estadisticas")
    public ResponseEntity<String> estadisticas() {
        return ResponseEntity.ok(
                adminService.estadisticas()
        );
    }

    // 🗑️ ELIMINAR USUARIO
    @DeleteMapping("/usuarios")
    public ResponseEntity<?> eliminarUsuario(@RequestParam String email) {

        try {
            adminService.eliminarUsuario(email);
            return ResponseEntity.ok(
                    Map.of("mensaje", "Usuario eliminado", "email", email)
            );
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error al eliminar usuario: " + e.getMessage());
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }
}