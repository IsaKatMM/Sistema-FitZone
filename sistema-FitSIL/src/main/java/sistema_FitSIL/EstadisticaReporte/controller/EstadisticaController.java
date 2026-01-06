package sistema_FitSIL.EstadisticaReporte.controller;

import org.springframework.web.bind.annotation.*;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import sistema_FitSIL.EstadisticaReporte.service.EstadisticaService;
import sistema_FitSIL.GestionUsuarios.service.UsuarioService;
import sistema_FitSIL.GestionUsuarios.model.Usuario;

import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaController {

    private final EstadisticaService service;
    private final UsuarioService usuarioService;

    public EstadisticaController(EstadisticaService service, UsuarioService usuarioService) {
        this.service = service;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Estadistica> listar() {
        return service.listar();
    }

    // 🔹 Genera automáticamente estadísticas para el usuario
    @PostMapping("/generar")
    public Estadistica generarEstadistica(@RequestParam String email, @RequestParam int minutos) {
        Usuario usuario = usuarioService.obtenerPerfil(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return service.generarEstadisticaAutomatica(usuario, minutos);
    }

    @GetMapping("/usuario/{email}")
    public List<Estadistica> buscarPorUsuario(@PathVariable String email) {
        Usuario usuario = usuarioService.obtenerPerfil(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return service.buscarPorUsuario(usuario);
    }

    @GetMapping("/promedio-estres/{email}")
    public double promedioEstres(@PathVariable String email) {
        Usuario usuario = usuarioService.obtenerPerfil(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return service.promedioEstres(usuario);
    }
}


