package sistema_FitSIL.GestionUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.service.AdministradorService;
import sistema_FitSIL.GestionUsuarios.security.JwtService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
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

    // 🆕 Login de administrador
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Administrador admin) {
        Optional<Administrador> logeado = adminService.login(admin.getCorreo(), admin.getContrasenia());
        
        if (logeado.isPresent()) {
            Administrador a = logeado.get();
            String token = jwtService.generarToken(a.getCorreo(), a.getRol().toString());
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("usuario", a); // Usamos "usuario" para mantener compatibilidad con el frontend
            respuesta.put("token", token);
            
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }
    
    // Crear administrador
    @PostMapping("/registro")
    public ResponseEntity<Administrador> registrar(@RequestBody Administrador admin) {
        admin.setContrasenia(passwordEncoder.encode(admin.getContrasenia()));
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