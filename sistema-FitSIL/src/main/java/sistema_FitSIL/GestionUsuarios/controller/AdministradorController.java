package sistema_FitSIL.GestionUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.security.crypto.password.PasswordEncoder;
=======
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
import org.springframework.web.bind.annotation.*;
import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.service.AdministradorService;

import java.util.List;

@RestController
@RequestMapping("/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService adminService;

<<<<<<< HEAD
    @Autowired
    private PasswordEncoder passwordEncoder; // ← inyectamos el encoder
    // Crear administrador
    @PostMapping("/registro")
    public ResponseEntity<Administrador> registrar(@RequestBody Administrador admin) {
        admin.setContrasenia(passwordEncoder.encode(admin.getContrasenia()));
=======
    // Crear administrador
    @PostMapping("/registro")
    public ResponseEntity<Administrador> registrar(@RequestBody Administrador admin) {
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
        return ResponseEntity.ok(adminService.registrarAdmin(admin));
    }

    // Actualizar administrador
    @PutMapping("/perfil")
    public ResponseEntity<Administrador> actualizar(@RequestParam String email, @RequestBody Administrador datos) {
        return ResponseEntity.ok(adminService.actualizarAdmin(email, datos));
    }

    // Eliminar administrador
    @DeleteMapping("/perfil")
    public ResponseEntity<String> eliminar(@RequestParam String email) {
        try {
            adminService.eliminarAdmin(email);
            return ResponseEntity.ok("Administrador eliminado: " + email);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Listar todos los usuarios
    @GetMapping("/usuarios")
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        return ResponseEntity.ok(adminService.listarUsuarios());
    }

    // Cambiar rol de usuario
    @PutMapping("/usuarios/rol")
    public ResponseEntity<Usuario> cambiarRol(@RequestParam String email, @RequestBody Usuario datos) {
        return ResponseEntity.ok(adminService.cambiarRol(email, datos.getRol().name()));
    }

    // Consultar estadísticas globales
    @GetMapping("/usuarios/estadisticas")
    public ResponseEntity<String> estadisticas() {
        return ResponseEntity.ok(adminService.estadisticas());
    }
}
