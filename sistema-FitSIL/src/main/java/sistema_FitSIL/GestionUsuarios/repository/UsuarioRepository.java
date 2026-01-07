package sistema_FitSIL.GestionUsuarios.repository;

import sistema_FitSIL.GestionUsuarios.model.Usuario;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String archivoUsuarios = "../data/usuarios.json";

    public UsuarioRepository() {
        File carpeta = new File("../data");
        if (!carpeta.exists()) {
            carpeta.mkdirs();
            System.out.println("Carpeta data creada en: " + carpeta.getAbsolutePath());
        }
        
        // Crear archivo vacío si no existe
        File file = new File(archivoUsuarios);
        if (!file.exists()) {
            try {
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, new ArrayList<Usuario>());
                System.out.println("Archivo usuarios.json creado");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // Leer todos los usuarios del archivo
    private List<Usuario> leerTodos() {
        try {
            File file = new File(archivoUsuarios);
            return objectMapper.readValue(file, new TypeReference<List<Usuario>>() {});
        } catch (IOException e) {
            System.err.println("Error al leer usuarios: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Guardar toda la lista en el archivo
    private void guardarTodos(List<Usuario> usuarios) {
        try {
            File file = new File(archivoUsuarios);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, usuarios);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar usuarios", e);
        }
    }

    // Guardar o actualizar usuario
    public Usuario guardar(Usuario usuario) {
        if (usuario.getCorreo() == null || usuario.getCorreo().isEmpty()) {
            throw new RuntimeException("El correo del usuario no puede ser nulo");
        }

        List<Usuario> usuarios = leerTodos();
        
        // Buscar si ya existe y actualizarlo
        Optional<Usuario> existente = usuarios.stream()
            .filter(u -> u.getCorreo().equals(usuario.getCorreo()))
            .findFirst();
        
        if (existente.isPresent()) {
            // Mantener el ID existente al actualizar
            usuario.setId(existente.get().getId());
            usuarios.remove(existente.get());
        } else {
            // Asignar nuevo ID si es un usuario nuevo
            Integer nuevoId = generarNuevoId(usuarios);
            usuario.setId(nuevoId);
        }
        
        usuarios.add(usuario);
        guardarTodos(usuarios);
        
        System.out.println("Usuario guardado: " + usuario.getCorreo() + " con ID: " + usuario.getId());
        return usuario;
    }

    // Generar un nuevo ID basado en el máximo ID existente
    private Integer generarNuevoId(List<Usuario> usuarios) {
        return usuarios.stream()
            .map(Usuario::getId)
            .filter(id -> id != null)
            .max(Integer::compareTo)
            .orElse(0) + 1;
    }

    // Buscar por correo
    public Optional<Usuario> buscarPorEmail(String email) {
        List<Usuario> usuarios = leerTodos();
        return usuarios.stream()
            .filter(u -> u.getCorreo().equals(email))
            .findFirst();
    }

    // Actualizar usuario
    public Usuario actualizar(Usuario usuario) {
        return guardar(usuario);
    }

    // Eliminar usuario
    public void eliminar(String email) {
        List<Usuario> usuarios = leerTodos();
        usuarios.removeIf(u -> u.getCorreo().equals(email));
        guardarTodos(usuarios);
        System.out.println("Usuario eliminado: " + email);
    }

    // Listar todos los usuarios
    public List<Usuario> listarTodos() {
        return leerTodos();
    }
}