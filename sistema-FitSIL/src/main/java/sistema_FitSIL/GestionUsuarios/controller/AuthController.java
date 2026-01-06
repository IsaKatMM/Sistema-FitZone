package sistema_FitSIL.GestionUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.repository.AdministradorRepository;
import sistema_FitSIL.GestionUsuarios.security.JwtService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdministradorRepository adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 🔐 Endpoint para autenticar administradores y generar un JWT válido.
     * Se espera un JSON con "correo" y "contrasenia" en el body.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String correo = body.get("correo");
        String contrasenia = body.get("contrasenia");

        if (correo == null || contrasenia == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Debe ingresar correo y contraseña"));
        }

        // Buscar administrador en la base de datos MySQL
        Optional<Administrador> adminOpt = adminRepo.findByCorreo(correo);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Usuario no encontrado"));
        }

        Administrador admin = adminOpt.get();

        // Validar contraseña con BCrypt
        if (!passwordEncoder.matches(contrasenia, admin.getContrasenia())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Contraseña incorrecta"));
        }

        // ✅ Generar token JWT válido incluyendo el rol del administrador
        String token = jwtService.generarToken(correo, admin.getRol().name());

        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Inicio de sesión exitoso");
        response.put("correo", correo);
        response.put("rol", admin.getRol().toString());
        response.put("token", token);

        return ResponseEntity.ok(response);
    }
}
