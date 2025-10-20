package sistema_FitSIL.GestionUsuarios.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final String SECRET_KEY = "fitsilSecret2025"; // variable de entorno en producción
    private final long EXPIRATION_MS = 3600000; // 1 hora

    // Generar token
    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Obtener email del token
    public String obtenerEmailDesdeToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
        return claims.getSubject();
    }

    // Obtener rol del token
    public String obtenerRolDesdeToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token.replace("Bearer ", ""))
                .getBody();
        return claims.get("rol", String.class);
    }

    // Validar token
    public boolean esTokenValido(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token.replace("Bearer ", ""))
                    .getBody();
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // Chequear si es admin
    public boolean tieneRolAdmin(String token) {
        String rol = obtenerRolDesdeToken(token);
        return "ADMIN".equalsIgnoreCase(rol);
    }
}
