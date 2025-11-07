package sistema_FitSIL.GestionUsuarios.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import sistema_FitSIL.GestionUsuarios.model.Administrador;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.repository.AdministradorRepository;
import sistema_FitSIL.GestionUsuarios.repository.UsuarioRepository;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private AdministradorRepository adminRepo;

    @Autowired
    private UsuarioRepository usuarioRepo;

    /**
     * 🔹 Método principal de Spring Security para autenticar un usuario.
     * @param correo Correo electrónico usado para login
     * @return UserDetails con username, password y roles
     * @throws UsernameNotFoundException si no existe el usuario
     */
    @Override
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {

        // Primero buscamos en administradores
        Optional<Administrador> adminOpt = adminRepo.findByCorreo(correo);
        if (adminOpt.isPresent()) {
            Administrador admin = adminOpt.get();
            return User.builder()
                    .username(admin.getCorreo())
                    .password(admin.getContrasenia())
                    .roles(admin.getRol().name()) // ADMINISTRADOR
                    .build();
        }

        // Luego buscamos en usuarios normales
        Optional<Usuario> userOpt = usuarioRepo.findByCorreo(correo);
        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            return User.builder()
                    .username(user.getCorreo())
                    .password(user.getContrasenia())
                    .roles(user.getRol().name()) // USUARIO
                    .build();
        }

        throw new UsernameNotFoundException("Usuario no encontrado: " + correo);
    }
}
