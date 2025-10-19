package sistema_FitSIL.GestionUsuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.repository.AdministradorRepository;

import java.util.List;

@Service
public class AdministradorService {

    @Autowired
    private AdministradorRepository adminRepository;

    // Crear administrador
    public Administrador registrarAdmin(Administrador admin) {
        return adminRepository.guardar(admin);
    }

    // Actualizar administrador
    public Administrador actualizarAdmin(String email, Administrador datos) {
        Administrador existente = adminRepository.buscarPorEmail(email)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        if (datos.getNombre() != null) existente.setNombre(datos.getNombre());
        if (datos.getDepartamento() != null) existente.setDepartamento(datos.getDepartamento());
        if (datos.getCodigoAdmin() != 0) existente.setCodigoAdmin(datos.getCodigoAdmin());
        if (datos.getContrasenia() != null) existente.setContrasenia(datos.getContrasenia());

        return adminRepository.guardar(existente);
    }

    // Eliminar administrador
    public void eliminarAdmin(String email) {
        if (adminRepository.buscarPorEmail(email).isPresent()) {
            adminRepository.eliminar(email);
        } else {
            throw new RuntimeException("Administrador no encontrado: " + email);
        }
    }

    // Gestionar usuarios
    public List<Usuario> listarUsuarios() {
        return adminRepository.listarUsuarios();
    }

    // Cambiar rol de usuario
    public Usuario cambiarRol(String email, String rol) {
        return adminRepository.cambiarRol(email, rol);
    }

    // Consultar estadísticas globales
    public String estadisticas() {
        return adminRepository.estadisticas();
    }
}
