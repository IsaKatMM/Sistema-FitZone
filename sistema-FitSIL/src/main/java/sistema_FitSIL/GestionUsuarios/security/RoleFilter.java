package sistema_FitSIL.GestionUsuarios.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import sistema_FitSIL.GestionUsuarios.repository.AdministradorRepository;

import java.io.IOException;
import java.util.List;

@Component
public class RoleFilter extends OncePerRequestFilter {

    @Autowired
    private AdministradorRepository adminRepo;

    // ✅ Rutas públicas sin necesidad de token
    private static final List<String> PUBLIC_PATHS = List.of(
        "/usuarios/registro",
        "/usuarios/login",
        "/auth/login",
        "/api/estadisticas"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();
        System.out.println("🔍 Ruta solicitada: " + path);

        // ✅ Permitir rutas públicas (usa startsWith)
        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ Permitir crear el primer administrador sin token
        if (path.startsWith("/administradores/registro")) {
            if (adminRepo.count() == 0) {
                filterChain.doFilter(request, response);
                return;
            }
        }

        // ✅ Para todo lo demás, exigir token JWT
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Acceso denegado: falta token JWT\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
