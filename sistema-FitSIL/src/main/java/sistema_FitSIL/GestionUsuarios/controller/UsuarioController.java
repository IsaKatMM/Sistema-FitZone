package sistema_FitSIL.GestionUsuarios.controller;

import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.service.UsuarioService;
import sistema_FitSIL.GestionUsuarios.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;

import sistema_FitSIL.GestionUsuarios.util.Sanitizer;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtService jwtService;

    // Registro de usuario
    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(
            @Valid @RequestBody Usuario usuario,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            String mensaje = bindingResult.getAllErrors()
                    .get(0)
                    .getDefaultMessage();
            return ResponseEntity.badRequest().body(null);
        }

        Usuario nuevo = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.status(201).body(nuevo);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Usuario usuario) {
        Optional<Usuario> logeado = usuarioService.login(usuario.getCorreo(), usuario.getContrasenia());
        if (logeado.isPresent()) {
            Usuario u = logeado.get();
            String token = jwtService.generarToken(u.getCorreo(), u.getRol().toString());
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("usuario", u);
            respuesta.put("token", token);
            return ResponseEntity.ok(respuesta);
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    // Obtener perfil (solo el mismo usuario)
    @GetMapping("/perfil/{email}")
    public ResponseEntity<Usuario> perfil(
            @PathVariable String email,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String correoToken = jwtService.obtenerCorreoDesdeToken(token);

        if (!correoToken.equals(email)) {
            return ResponseEntity.status(403).build();
        }

        return usuarioService.obtenerPerfil(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar perfil
    @PutMapping("/perfil")
    public ResponseEntity<Usuario> actualizar(
            @RequestParam String email,
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Usuario datos) {

        String token = authHeader.replace("Bearer ", "");
        String correoToken = jwtService.obtenerCorreoDesdeToken(token);

        if (!correoToken.equals(email)) {
            return ResponseEntity.status(403).build();
        }

        Usuario actualizado = usuarioService.actualizarPerfil(email, datos);
        return ResponseEntity.ok(actualizado);
    }

    // Eliminar perfil
    @DeleteMapping("/perfil")
    public ResponseEntity<String> eliminar(
            @RequestParam String email,
            @RequestHeader("Authorization") String authHeader) {

        String token = authHeader.replace("Bearer ", "");
        String correoToken = jwtService.obtenerCorreoDesdeToken(token);

        if (!correoToken.equals(email)) {
            return ResponseEntity.status(403).build();
        }

        try {
            usuarioService.eliminarUsuario(email);
            return ResponseEntity.ok("Usuario eliminado: " + email);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
