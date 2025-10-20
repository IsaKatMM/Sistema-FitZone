package sistema_FitSIL.GestionUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
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
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AdministradorRepository adminRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String correo = body.get("correo");
        String contrasenia = body.get("contrasenia");

        // Buscar admin en JSON
        Optional<Administrador> adminOpt = adminRepo.buscarPorEmail(correo);
        if (adminOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuario no encontrado");
        }

        Administrador admin = adminOpt.get();

        // Validar contraseña con BCrypt
        if (!passwordEncoder.matches(contrasenia, admin.getContrasenia())) {
            return ResponseEntity.status(401).body("Contraseña incorrecta");
        }

        // Generar JWT
        String token = jwtService.generateToken(new HashMap<>(), correo);

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }
}
