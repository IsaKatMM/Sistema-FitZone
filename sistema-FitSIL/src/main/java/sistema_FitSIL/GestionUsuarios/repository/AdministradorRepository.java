package sistema_FitSIL.GestionUsuarios.repository;

import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.model.Rol;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
    
    @Autowired
    private UsuarioRepository usuarioRepository;

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
            admins.remove(existente.get());
        }
        
        admins.add(admin);
        guardarTodos(admins);
        
        System.out.println("Administrador guardado: " + admin.getCorreo());
        return admin;
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

    // Listar todos los usuarios (delega al UsuarioRepository)
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.listarTodos();
    }

    // Cambiar rol de usuario
    public Usuario cambiarRol(String email, String rol) {
        Optional<Usuario> usuarioOpt = usuarioRepository.buscarPorEmail(email);
        
        if (!usuarioOpt.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        Usuario usuario = usuarioOpt.get();
        usuario.setRol(Enum.valueOf(Rol.class, rol));
        return usuarioRepository.guardar(usuario);
    }

    // Estadísticas globales
    public String estadisticas() {
        List<Usuario> usuarios = usuarioRepository.listarTodos();
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