package sistema_FitSIL.GestionEjercicios.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import sistema_FitSIL.GestionEjercicios.model.Ejercicio;
import sistema_FitSIL.GestionEjercicios.service.EjercicioService;

@RestController
@RequestMapping("/ejercicios")
public class EjercicioController {
    private final EjercicioService ejercicioService;

    //inyeccion del servicio (lo conecta)
    public EjercicioController(EjercicioService ejercicioService) {
        this.ejercicioService = ejercicioService;
    }

    // Endpoint para crear o actualizar un ejercicio
    @PostMapping("/guardar")
    public Ejercicio guardarEjercicio(@RequestBody Ejercicio ejercicio) {
        return ejercicioService.guardarEjercicio(ejercicio);
    }

    // Endpoint para obtener todos los ejercicios
    @GetMapping("/obtener")
    public List<Ejercicio> obtenerTodosLosEjercicios() {
        return ejercicioService.obtenerTodosLosEjercicios();
    }

    // Endpoint para buscar un ejercicio por nombre
    @GetMapping("/buscar")
    public Ejercicio buscarPorNombre(@RequestParam String nombre) {
        return ejercicioService.buscarPorNombre(nombre);
    }
}
