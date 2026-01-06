package sistema_FitSIL.GestionUsuarios.repository;

import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.model.Rol;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class AdministradorRepository {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String archivoAdmins = "../data/administradores.json";
    private final String archivoUsuarios = "../data/usuarios.json";

    public AdministradorRepository() {
        File carpeta = new File("../data");
        if (!carpeta.exists()) {
            carpeta.mkdirs();
        }
        
        // Crear archivo vacío si no existe
        File file = new File(archivoAdmins);
        if (!file.exists()) {
            try {
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, new ArrayList<Administrador>());
                System.out.println("Archivo administradores.json creado");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    // ========== MÉTODOS PARA ADMINISTRADORES ==========
    
    // Leer todos los administradores del archivo
    private List<Administrador> leerTodos() {
        try {
            File file = new File(archivoAdmins);
            return objectMapper.readValue(file, new TypeReference<List<Administrador>>() {});
        } catch (IOException e) {
            System.err.println("Error al leer administradores: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Guardar toda la lista en el archivo
    private void guardarTodos(List<Administrador> admins) {
        try {
            File file = new File(archivoAdmins);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, admins);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar administradores", e);
        }
    }

    // Guardar o actualizar administrador
    public Administrador guardar(Administrador admin) {
        if (admin.getCorreo() == null || admin.getCorreo().isEmpty()) {
            throw new RuntimeException("Correo obligatorio");
        }

        List<Administrador> admins = leerTodos();
        
        // Buscar si ya existe y actualizarlo
        Optional<Administrador> existente = admins.stream()
            .filter(a -> a.getCorreo().equals(admin.getCorreo()))
            .findFirst();
        
        if (existente.isPresent()) {
            // Mantener el ID existente al actualizar
            admin.setId(existente.get().getId());
            admins.remove(existente.get());
        } else {
            // Asignar nuevo ID si es un administrador nuevo
            Integer nuevoId = generarNuevoId(admins);
            admin.setId(nuevoId);
        }
        
        admins.add(admin);
        guardarTodos(admins);
        
        System.out.println("Administrador guardado: " + admin.getCorreo() + " con ID: " + admin.getId());
        return admin;
    }

    // Generar un nuevo ID basado en el máximo ID existente
    private Integer generarNuevoId(List<Administrador> admins) {
        return admins.stream()
            .map(Administrador::getId)
            .filter(id -> id != null)
            .max(Integer::compareTo)
            .orElse(0) + 1;
    }

    // Buscar administrador por correo
    public Optional<Administrador> buscarPorEmail(String email) {
        List<Administrador> admins = leerTodos();
        return admins.stream()
            .filter(a -> a.getCorreo().equals(email))
            .findFirst();
    }

    // Eliminar administrador
    public void eliminar(String email) {
        List<Administrador> admins = leerTodos();
        admins.removeIf(a -> a.getCorreo().equals(email));
        guardarTodos(admins);
        System.out.println("Administrador eliminado: " + email);
    }

    // Listar todos los administradores
    public List<Administrador> listarTodos() {
        return leerTodos();
    }

    // ========== MÉTODOS PARA GESTIONAR USUARIOS ==========
    
    // Leer todos los usuarios directamente del archivo JSON
    private List<Usuario> leerTodosUsuarios() {
        try {
            File file = new File(archivoUsuarios);
            if (!file.exists()) {
                return new ArrayList<>();
            }
            return objectMapper.readValue(file, new TypeReference<List<Usuario>>() {});
        } catch (IOException e) {
            System.err.println("Error al leer usuarios: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    // Guardar todos los usuarios directamente en el archivo JSON
    private void guardarTodosUsuarios(List<Usuario> usuarios) {
        try {
            File file = new File(archivoUsuarios);
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, usuarios);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar usuarios", e);
        }
    }

    // Listar todos los usuarios
    public List<Usuario> listarUsuarios() {
        return leerTodosUsuarios();
    }

    // Cambiar rol de usuario
    public Usuario cambiarRol(String email, String rol) {
        List<Usuario> usuarios = leerTodosUsuarios();
        
        Optional<Usuario> usuarioOpt = usuarios.stream()
            .filter(u -> u.getCorreo().equals(email))
            .findFirst();
        
        if (!usuarioOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        usuario.setRol(Enum.valueOf(Rol.class, rol));
        
        // Actualizar en la lista y guardar
        usuarios.removeIf(u -> u.getCorreo().equals(email));
        usuarios.add(usuario);
        guardarTodosUsuarios(usuarios);
        
        System.out.println("Rol cambiado para usuario: " + email + " -> " + rol);
        return usuario;
    }

    // Estadísticas globales
    public String estadisticas() {
        List<Usuario> usuarios = leerTodosUsuarios();
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