package sistema_FitSIL.EstadisticaReporte.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sistema_FitSIL.EstadisticaReporte.dto.ResumenDTO;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import sistema_FitSIL.EstadisticaReporte.service.EstadisticaService;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.service.UsuarioService;

import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaController {

    private final EstadisticaService service;
    private final UsuarioService usuarioService;

    public EstadisticaController(
            EstadisticaService service,
            UsuarioService usuarioService
    ) {
        this.service = service;
        this.usuarioService = usuarioService;
    }

    // 🔹 Todas las estadísticas del usuario autenticado
    @GetMapping("/usuario")
    public List<Estadistica> estadisticasUsuario(Authentication auth) {
        String email = auth.getName();
        Usuario usuario = usuarioService.obtenerPerfil(email).orElseThrow();
        return service.buscarPorUsuario(usuario);
    }

    // 🔹 Resumen por rango
    @GetMapping("/usuario/resumen")
    public ResumenDTO resumen(
            @RequestParam String rango,
            Authentication auth
    ) {
        String email = auth.getName();
        Usuario usuario = usuarioService.obtenerPerfil(email).orElseThrow();
        return service.obtenerResumen(usuario, rango);
    }

    // 🔹 Promedio de estrés
    @GetMapping("/usuario/promedio-estres")
    public double promedioEstres(Authentication auth) {
        String email = auth.getName();
        Usuario usuario = usuarioService.obtenerPerfil(email).orElseThrow();
        return service.promedioEstres(usuario);
    }

    // 🔹 Generar estadística automática (test)
    @PostMapping("/generar")
    public Estadistica generar(
            @RequestParam int minutos,
            Authentication auth
    ) {
        String email = auth.getName();
        Usuario usuario = usuarioService.obtenerPerfil(email).orElseThrow();
        return service.generarEstadisticaAutomatica(usuario, minutos);
    }
}
