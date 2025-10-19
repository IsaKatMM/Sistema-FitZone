package sistema_FitSIL.GestionUsuarios.repository;

import sistema_FitSIL.GestionUsuarios.model.Usuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;

import java.io.File;
import java.io.IOException;
import java.util.Optional;





@Repository
public class UsuarioRepository {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String carpetaUsuarios = "../dataUsuarios/"; // ruta relativa

    public UsuarioRepository() {
        File carpeta = new File(carpetaUsuarios);
        if (!carpeta.exists()) {
            carpeta.mkdirs();
            System.out.println("Carpeta dataUsuarios creada en: " + carpeta.getAbsolutePath());
        }
    }

    public Usuario guardar(Usuario usuario) {
        if (usuario.getCorreo() == null || usuario.getCorreo().isEmpty()) {
            throw new RuntimeException("El correo del usuario no puede ser nulo");
        }
        try {
            File file = new File(carpetaUsuarios + usuario.getCorreo() + ".json");
            objectMapper.writeValue(file, usuario);
            System.out.println("Usuario guardado en: " + file.getAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar usuario", e);
        }
        return usuario;
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        try {
            File file = new File(carpetaUsuarios + email + ".json");
            if (!file.exists()) return Optional.empty();
            Usuario usuario = objectMapper.readValue(file, Usuario.class);
            return Optional.of(usuario);
        } catch (IOException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    public Usuario actualizar(Usuario usuario) {
        return guardar(usuario);
    }

    public void eliminar(String email) {
        File file = new File(carpetaUsuarios + email + ".json");
        if (file.exists()) file.delete();
    }



}
