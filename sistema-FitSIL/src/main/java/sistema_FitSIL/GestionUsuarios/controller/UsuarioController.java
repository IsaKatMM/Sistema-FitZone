package sistema_FitSIL.GestionUsuarios.controller;

import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario nuevo = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.status(201).body(nuevo);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Usuario usuario) {
        Optional<Usuario> logeado = usuarioService.login(usuario.getCorreo(), usuario.getContrasenia());

        if (logeado.isPresent()) {
            return ResponseEntity.ok(logeado.get());
        } else {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    @GetMapping("/perfil/{email}")
    public ResponseEntity<Usuario> perfil(@PathVariable String email) {
        return usuarioService.obtenerPerfil(email)
                .map(u -> ResponseEntity.ok(u))
                .orElse(ResponseEntity.notFound().build());
    }

    /*
     * @PutMapping("/perfil/{email}")
     * public ResponseEntity<Usuario> actualizar(@PathVariable String
     * email, @RequestBody Usuario datos) {
     * Usuario actualizado = usuarioService.actualizarPerfil(email, datos);
     * return ResponseEntity.ok(actualizado);
     * }
     */

    // Actualizar perfil
    @PutMapping("/perfil")
    public ResponseEntity<Usuario> actualizar(@RequestParam String email, @RequestBody Usuario datos) {
        Usuario actualizado = usuarioService.actualizarPerfil(email, datos);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/perfil")
    public ResponseEntity<String> eliminar(@RequestParam String email) {
        try {
            usuarioService.eliminarUsuario(email);
            return ResponseEntity.ok("Usuario eliminado: " + email);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

}