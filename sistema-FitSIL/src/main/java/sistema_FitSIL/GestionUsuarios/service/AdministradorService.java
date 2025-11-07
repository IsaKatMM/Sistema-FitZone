package sistema_FitSIL.GestionUsuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.repository.AdministradorRepository;
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;

import java.util.List;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository adminRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Administrador registrarAdmin(Administrador admin) {
        return adminRepository.save(admin);
    }

    public Administrador actualizarAdmin(String email, Administrador datos) {
        Administrador existente = adminRepository.findByCorreo(email)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        if (datos.getNombre() != null) existente.setNombre(datos.getNombre());
        if (datos.getDepartamento() != null) existente.setDepartamento(datos.getDepartamento());
        if (datos.getCodigoAdmin() != 0) existente.setCodigoAdmin(datos.getCodigoAdmin());
        if (datos.getContrasenia() != null) existente.setContrasenia(datos.getContrasenia());

        return adminRepository.save(existente);
    }

    public void eliminarAdmin(String email) {
        Administrador admin = adminRepository.findByCorreo(email)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado: " + email));
        adminRepository.delete(admin);
    }

    // ✅ Delegar usuarios al repo correspondiente
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario cambiarRol(String correo, String rol) {
        Usuario u = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        u.setRol(Enum.valueOf(sistema_FitSIL.GestionUsuarios.model.Rol.class, rol));
        return usuarioRepository.save(u);
    }

    public String estadisticas() {
        List<Usuario> usuarios = usuarioRepository.findAll();
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
