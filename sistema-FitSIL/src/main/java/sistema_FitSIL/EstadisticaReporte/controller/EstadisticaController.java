package sistema_FitSIL.EstadisticaReporte.controller;

import org.springframework.web.bind.annotation.*;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import sistema_FitSIL.EstadisticaReporte.service.EstadisticaService;

import java.util.List;

@RestController
@RequestMapping("/api/estadisticas")
public class EstadisticaController {

    private final EstadisticaService service;

    public EstadisticaController(EstadisticaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Estadistica> listar() {
        return service.listar();
    }

    @PostMapping
    public String agregar(@RequestBody Estadistica e) {
        service.agregar(e);
        return "Estadística registrada correctamente";
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<Estadistica> buscarPorUsuario(@PathVariable String idUsuario) {
        return service.buscarPorUsuario(idUsuario);
    }

    @GetMapping("/promedio-estres/{idUsuario}")
    public double promedioEstres(@PathVariable String idUsuario) {
        return service.promedioEstres(idUsuario);
    }
}
