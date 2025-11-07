package sistema_FitSIL.GestionUsuarios.service;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;
import sistema_FitSIL.GestionUsuarios.util.Sanitizer;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepo;
    private final PasswordEncoder passwordEncoder;
    private final Validator validator;

    // Map para controlar intentos fallidos
    private final Map<String, Integer> intentosFallidos = new HashMap<>();
    private static final int MAX_INTENTOS = 5;

    public UsuarioService(UsuarioRepository usuarioRepo,
                          PasswordEncoder passwordEncoder,
                          Validator validator) {
        this.usuarioRepo = usuarioRepo;
        this.passwordEncoder = passwordEncoder;
        this.validator = validator;
    }

    // Registrar usuario
    public Usuario registrarUsuario(Usuario usuario) {
        // Sanitizar campos
        usuario.setNombre(Sanitizer.sanitize(usuario.getNombre()));
        usuario.setApellido(Sanitizer.sanitize(usuario.getApellido()));
        usuario.setUsuario(Sanitizer.sanitize(usuario.getUsuario()));

        // Validación Bean
        Set<ConstraintViolation<Usuario>> violations = validator.validate(usuario);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // Codificar contraseña
        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));

        // Persistir en MySQL
        return usuarioRepo.save(usuario);
    }

    // Login de usuario
    public Optional<Usuario> login(String correo, String contrasenia) {
        int intentos = intentosFallidos.getOrDefault(correo, 0);

        if (intentos >= MAX_INTENTOS) {
            throw new RuntimeException("Usuario bloqueado por " + MAX_INTENTOS + " intentos fallidos");
        }

        Optional<Usuario> opt = usuarioRepo.findByCorreo(correo);

        if (opt.isPresent() && passwordEncoder.matches(contrasenia, opt.get().getContrasenia())) {
            // Login exitoso -> resetear contador
            intentosFallidos.put(correo, 0);
            return opt;
        } else {
            // Incrementar intentos fallidos
            intentosFallidos.put(correo, intentos + 1);
            int restantes = MAX_INTENTOS - (intentos + 1);
            if (restantes > 0) {
                throw new RuntimeException("Contraseña incorrecta. Te quedan " + restantes + " intentos");
            } else {
                throw new RuntimeException("Usuario bloqueado por " + MAX_INTENTOS + " intentos fallidos");
            }
        }
    }

    // Obtener perfil
    public Optional<Usuario> obtenerPerfil(String correo) {
        return usuarioRepo.findByCorreo(correo);
    }

    // Actualizar perfil
    public Usuario actualizarPerfil(String correo, Usuario datos) {
        Usuario u = usuarioRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        u.setNombre(datos.getNombre());
        u.setApellido(datos.getApellido());
        u.setTelefono(datos.getTelefono());
        u.setPeso(datos.getPeso());
        u.setAltura(datos.getAltura());

        return usuarioRepo.save(u);
    }

    // Eliminar usuario
    public void eliminarUsuario(String correo) {
        Usuario u = usuarioRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuarioRepo.delete(u);
    }

    // Listar todos los usuarios
    public List<Usuario> listarUsuarios() {
        return usuarioRepo.findAll();
    }

    // Cambiar rol de usuario
    public Usuario cambiarRol(String correo, String rol) {
        Usuario u = usuarioRepo.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setRol(Enum.valueOf(sistema_FitSIL.GestionUsuarios.model.Rol.class, rol));
        return usuarioRepo.save(u);
    }

    // Estadísticas globales
    public String estadisticas() {
        List<Usuario> usuarios = usuarioRepo.findAll();
        double totalPeso = usuarios.stream().mapToDouble(Usuario::getPeso).sum();
        double totalAltura = usuarios.stream().mapToDouble(Usuario::getAltura).sum();
        int totalUsuarios = usuarios.size();

        double promedioPeso = totalUsuarios > 0 ? totalPeso / totalUsuarios : 0;
        double promedioAltura = totalUsuarios > 0 ? totalAltura / totalUsuarios : 0;

        return String.format(
                "{\"totalUsuarios\":%d,\"promedioPeso\":%.2f,\"promedioAltura\":%.2f}",
                totalUsuarios, promedioPeso, promedioAltura
        );
    }
}
