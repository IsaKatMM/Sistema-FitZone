package sistema_FitSIL.GestionUsuarios.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.function.Function;
=======
import org.springframework.stereotype.Service;

import java.util.Date;
>>>>>>> 8340bd0 (v3, apis - Usuario controller)

@Service
public class JwtService {

<<<<<<< HEAD
    @Value("${jwt.secret}")
    private final String SECRET_KEY = "EstaEsUnaClaveMuySeguraQueTieneMasDe32Bytes!";

    private static final long EXPIRATION_TIME = 1000 * 60 * 60; // 1 hora

    // ✅ Genera token con correo y rol
    public String generarToken(String correo, String rol) {
        return Jwts.builder()
                .setSubject(correo)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
=======
    private final String SECRET_KEY = "fitsilSecret2025"; // variable de entorno en producción
    private final long EXPIRATION_MS = 3600000; // 1 hora

    // Generar token
    public String generarToken(String email, String rol) {
        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
>>>>>>> 8340bd0 (v3, apis - Usuario controller)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

<<<<<<< HEAD
    // ✅ Valida que el token pertenezca al usuario correcto
    public boolean validarToken(String token, String correo) {
        final String correoExtraido = extraerCorreo(token);
        return (correoExtraido.equals(correo) && !estaExpirado(token));
    }

    // ✅ Extrae correo (subject)
    public String extraerCorreo(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    // ✅ Extrae rol del JWT
    public String extraerRol(String token) {
        return extraerClaim(token, claims -> claims.get("rol", String.class));
    }

    // ✅ Nuevo método usado por el controlador
    public String obtenerCorreoDesdeToken(String token) {
        return extraerCorreo(token);
    }

    private <T> T extraerClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extraerTodosClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extraerTodosClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean estaExpirado(String token) {
        return extraerExpiration(token).before(new Date());
    }

    private Date extraerExpiration(String token) {
        return extraerClaim(token, Claims::getExpiration);
=======
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
>>>>>>> 8340bd0 (v3, apis - Usuario controller)
    }
}
