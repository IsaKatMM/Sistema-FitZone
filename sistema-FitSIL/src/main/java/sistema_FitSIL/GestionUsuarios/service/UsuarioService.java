package sistema_FitSIL.GestionUsuarios.service;

<<<<<<< HEAD
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
=======
import sistema_FitSIL.GestionUsuarios.model.Persona;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)

@Service
public class UsuarioService {

<<<<<<< HEAD
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

     public Usuario registrarUsuario(Usuario usuario) {
        // 1) Sanitizar campos que aceptan texto libre
        usuario.setNombre(Sanitizer.sanitize(usuario.getNombre()));
        usuario.setApellido(Sanitizer.sanitize(usuario.getApellido()));
        usuario.setUsuario(Sanitizer.sanitize(usuario.getUsuario()));

        // 2) Validación programática (Bean Validation)
        Set<ConstraintViolation<Usuario>> violations = validator.validate(usuario);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // 3) Codificar contraseña
        usuario.setContrasenia(passwordEncoder.encode(usuario.getContrasenia()));

        // 4) Persistir (repositorio)
        return usuarioRepo.guardar(usuario);
    }

      public Optional<Usuario> login(String correo, String contrasenia) {
        int intentos = intentosFallidos.getOrDefault(correo, 0);

        // Verificar si está bloqueado
        if (intentos >= MAX_INTENTOS) {
            throw new RuntimeException("Usuario bloqueado por " + MAX_INTENTOS + " intentos fallidos");
        }

        Optional<Usuario> opt = usuarioRepo.buscarPorEmail(correo);

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


    public Optional<Usuario> obtenerPerfil(String correo) {
        return usuarioRepo.buscarPorEmail(correo);
    }

    public Usuario actualizarPerfil(String correo, Usuario datos) {
        Usuario u = usuarioRepo.buscarPorEmail(correo).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        // Solo actualizamos campos permitidos, sanitizados en la entidad
        u.setNombre(datos.getNombre());
        u.setApellido(datos.getApellido());
        u.setTelefono(datos.getTelefono());
        u.setPeso(datos.getPeso());
        u.setAltura(datos.getAltura());
        return usuarioRepo.actualizar(u);
    }

    public void eliminarUsuario(String correo) {
        usuarioRepo.eliminar(correo);
    }
=======
    @Autowired
    private UsuarioRepository usuarioRepository;

    // Registrar usuario
    public Usuario registrarUsuario(Usuario usuario) {
        return usuarioRepository.guardar(usuario);
    }

    // Login
    public Optional<Usuario> login(String email, String password) {
        Optional<Usuario> usuario = usuarioRepository.buscarPorEmail(email);
        if (usuario.isPresent() && usuario.get().getContrasenia().equals(password)) {
            return usuario;
        }
        return Optional.empty();
    }

    // Obtener perfil
    public Optional<Usuario> obtenerPerfil(String email) {
        return usuarioRepository.buscarPorEmail(email);
    }

    // Actualizar perfil
        // Actualizar perfil
    public Usuario actualizarPerfil(String email, Usuario datos) {
        Usuario usuarioExistente = usuarioRepository.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (datos.getNombre() != null) usuarioExistente.setNombre(datos.getNombre());
        if (datos.getPeso() != 0) usuarioExistente.setPeso(datos.getPeso());
        if (datos.getAltura() != 0) usuarioExistente.setAltura(datos.getAltura());
        if (datos.getContrasenia() != null) usuarioExistente.setContrasenia(datos.getContrasenia());
        return usuarioRepository.guardar(usuarioExistente);
    }

       public void eliminarUsuario(String email) {
        // Verifica si el usuario existe antes de eliminar
        if (usuarioRepository.buscarPorEmail(email).isPresent()) {
            usuarioRepository.eliminar(email);
        } else {
            throw new RuntimeException("Usuario no encontrado: " + email);
        }
    }
<<<<<<< HEAD
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
}
=======
}
>>>>>>> 8340bd0 (v3, apis - Usuario controller)
