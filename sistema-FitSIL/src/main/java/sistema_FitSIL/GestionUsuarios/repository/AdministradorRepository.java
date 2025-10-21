package sistema_FitSIL.GestionUsuarios.repository;

import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
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

    // ✅ Ahora los datos se guardan dentro de tu estructura visible del proyecto
    private final String carpetaAdmins = "src/main/java/sistema_FitSIL/dataAdministradores/";
    private final String carpetaUsuarios = "src/main/java/sistema_FitSIL/dataUsuarios/";

    public AdministradorRepository() {
        new File(carpetaAdmins).mkdirs();
        new File(carpetaUsuarios).mkdirs();
    }

    // 🔹 Guardar administrador en JSON
    public Administrador guardar(Administrador admin) {
        if (admin.getCorreo() == null || admin.getCorreo().isEmpty())
            throw new RuntimeException("Correo obligatorio");

        try {
            File file = new File(carpetaAdmins + admin.getCorreo() + ".json");
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, admin);
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar administrador", e);
        }

        return admin;
    }

    // 🔹 Buscar administrador por correo
    public Optional<Administrador> buscarPorEmail(String email) {
        try {
            File file = new File(carpetaAdmins + email + ".json");
            if (!file.exists()) return Optional.empty();
            Administrador admin = objectMapper.readValue(file, Administrador.class);
            return Optional.of(admin);
        } catch (IOException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    // 🔹 Eliminar administrador
    public void eliminar(String email) {
        File file = new File(carpetaAdmins + email + ".json");
        if (file.exists()) file.delete();
    }

    // 🔹 Listar todos los usuarios
    public List<Usuario> listarUsuarios() {
        List<Usuario> lista = new ArrayList<>();
        File carpeta = new File(carpetaUsuarios);
        File[] archivos = carpeta.listFiles();

        if (archivos != null) {
            for (File f : archivos) {
                try {
                    Usuario u = objectMapper.readValue(f, Usuario.class);
                    lista.add(u);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return lista;
    }

    // 🔹 Cambiar rol de usuario
    public Usuario cambiarRol(String email, String rol) {
        try {
            File file = new File(carpetaUsuarios + email + ".json");
            if (!file.exists()) throw new RuntimeException("Usuario no encontrado");

            Usuario u = objectMapper.readValue(file, Usuario.class);
            u.setRol(Enum.valueOf(sistema_FitSIL.GestionUsuarios.model.Rol.class, rol));
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(file, u);
            return u;
        } catch (IOException e) {
            throw new RuntimeException("Error al cambiar rol", e);
        }
    }

    // 🔹 Estadísticas globales
    public String estadisticas() {
        List<Usuario> usuarios = listarUsuarios();
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
