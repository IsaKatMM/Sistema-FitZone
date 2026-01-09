package sistema_FitSIL.GestionUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import sistema_FitSIL.GestionUsuarios.model.Persona;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;
import sistema_FitSIL.GestionUsuarios.repository.AdministradorRepository;
import sistema_FitSIL.GestionUsuarios.security.JwtService;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepo;

    @Autowired
    private AdministradorRepository adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String correo = body.get("correo");
        String contrasenia = body.get("contrasenia");

        if (correo == null || contrasenia == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Correo y contraseña son obligatorios"));
        }

        // 🔍 BUSCAR EN AMBAS TABLAS
        Persona persona = null;
        
        // Primero buscar en Usuario
        Optional<Usuario> usuarioOpt = usuarioRepo.findByCorreo(correo);
        if (usuarioOpt.isPresent()) {
            persona = usuarioOpt.get();
        } else {
            // Si no es Usuario, buscar en Administrador
            Optional<Administrador> adminOpt = adminRepo.findByCorreo(correo);
            if (adminOpt.isPresent()) {
                persona = adminOpt.get();
            }
        }

        // Si no se encontró en ninguna tabla
        if (persona == null) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        // 🔐 VERIFICAR CONTRASEÑA
        if (!passwordEncoder.matches(contrasenia, persona.getContrasenia())) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Credenciales inválidas"));
        }

        // ✅ GENERAR TOKEN
        String token = jwtService.generarToken(
                persona.getCorreo(),
                persona.getRol().name()
        );

        // ✅ RESPUESTA CONSISTENTE con el frontend
        Map<String, Object> response = new HashMap<>();
        response.put("correo", persona.getCorreo());
        response.put("rol", persona.getRol().name());
        response.put("token", token);
        response.put("nombre", persona.getNombre());
        response.put("usuario", persona); // Para compatibilidad

        return ResponseEntity.ok(response);
    }
}