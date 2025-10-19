package sistema_FitSIL.GestionUsuarios.service;

import sistema_FitSIL.GestionUsuarios.model.Persona;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

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
}
