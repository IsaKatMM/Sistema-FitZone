package sistema_FitSIL.GestionUsuarios.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Rol;
import sistema_FitSIL.GestionUsuarios.repository.AdministradorRepository;

@Component
public class DataSeeder {

    @Autowired
    private AdministradorRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void init() {
        // Solo crea el admin si la tabla está vacía
        if (adminRepository.count() == 0) {
            Administrador admin = new Administrador();
            admin.setNombre("Super Admin");
            admin.setCorreo("admin@fitsil.com");
            admin.setUsuario("adminroot");
            admin.setDepartamento("Sistemas");
            admin.setCodigoAdmin(1001);
            admin.setContrasenia(passwordEncoder.encode("Admin123"));
            admin.setRol(Rol.ADMINISTRADOR);

            adminRepository.save(admin);

            System.out.println("✅ Administrador inicial creado:");
            System.out.println("   Usuario: admin@fitsil.com");
            System.out.println("   Contraseña: Admin123");
        } else {
            System.out.println("🔹 Administrador inicial ya existe. Seeder omitido.");
        }
    }
}
