package sistema_FitSIL.GestionUsuarios.repository;

import sistema_FitSIL.GestionUsuarios.model.Usuario;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;
<<<<<<< HEAD
=======
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)

import java.io.File;
import java.io.IOException;
import java.util.Optional;

<<<<<<< HEAD
=======




>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
@Repository
public class UsuarioRepository {

    private final ObjectMapper objectMapper = new ObjectMapper();
<<<<<<< HEAD
    private final String carpetaUsuarios = "src/main/java/sistema_FitSIL/dataUsuarios/"; // ruta dentro del proyecto
=======
    private final String carpetaUsuarios = "../dataUsuarios/"; // ruta relativa
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)

    public UsuarioRepository() {
        File carpeta = new File(carpetaUsuarios);
        if (!carpeta.exists()) {
            carpeta.mkdirs();
            System.out.println("Carpeta dataUsuarios creada en: " + carpeta.getAbsolutePath());
        }
    }

<<<<<<< HEAD
    // Guardar usuario
=======
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
    public Usuario guardar(Usuario usuario) {
        if (usuario.getCorreo() == null || usuario.getCorreo().isEmpty()) {
            throw new RuntimeException("El correo del usuario no puede ser nulo");
        }
        try {
            File file = new File(carpetaUsuarios + usuario.getCorreo() + ".json");
<<<<<<< HEAD
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, usuario);
=======
            objectMapper.writeValue(file, usuario);
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
            System.out.println("Usuario guardado en: " + file.getAbsolutePath());
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar usuario", e);
        }
        return usuario;
    }

<<<<<<< HEAD
    // Buscar por correo
=======
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
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

<<<<<<< HEAD
    // Actualizar usuario
=======
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
    public Usuario actualizar(Usuario usuario) {
        return guardar(usuario);
    }

<<<<<<< HEAD
    // Eliminar usuario
=======
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
    public void eliminar(String email) {
        File file = new File(carpetaUsuarios + email + ".json");
        if (file.exists()) file.delete();
    }
<<<<<<< HEAD
=======



<<<<<<< HEAD
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
}
=======
}
>>>>>>> 8340bd0 (v3, apis - Usuario controller)
