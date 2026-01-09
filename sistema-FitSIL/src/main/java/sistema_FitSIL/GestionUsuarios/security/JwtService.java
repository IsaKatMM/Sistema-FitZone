package sistema_FitSIL.GestionUsuarios.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    private static final String SECRET_KEY =
            "EstaEsUnaClaveMuySeguraQueTieneMasDe32Bytes!";

    private static final long EXPIRATION_TIME = 1000 * 60 * 60;

    public String generarToken(String correo, String rol) {
        return Jwts.builder()
                .setSubject(correo)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public String obtenerCorreoDesdeToken(String token) {
        return extraerClaim(token, Claims::getSubject);
    }

    public boolean validarToken(String token, String correo) {
        return obtenerCorreoDesdeToken(token).equals(correo)
                && !estaExpirado(token);
    }

    private boolean estaExpirado(String token) {
        return extraerClaim(token, Claims::getExpiration)
                .before(new Date());
    }

    private <T> T extraerClaim(String token,
                               Function<Claims, T> claimsResolver) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}
