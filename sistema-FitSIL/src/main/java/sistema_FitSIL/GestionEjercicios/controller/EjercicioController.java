package sistema_FitSIL.GestionEjercicios.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import sistema_FitSIL.GestionEjercicios.model.Ejercicio;
import sistema_FitSIL.GestionEjercicios.service.EjercicioService;

@RestController
@RequestMapping("/ejercicios")
@CrossOrigin(origins = "*")
public class EjercicioController {

    private final EjercicioService ejercicioService;

    public EjercicioController(EjercicioService ejercicioService) {
        this.ejercicioService = ejercicioService;
    }

    // Crear o actualizar un ejercicio → solo admin
    @PostMapping("/guardar")
    public ResponseEntity<?> guardarEjercicio(@RequestBody Ejercicio ejercicio,
                                              Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ROLE_ADMINISTRADOR"));

        if (!isAdmin) {
            return ResponseEntity.status(403)
                    .body("Acceso denegado: solo administradores pueden crear ejercicios");
        }

        Ejercicio guardado = ejercicioService.guardarEjercicio(ejercicio);
        return ResponseEntity.ok(guardado);
    }

    // Obtener todos los ejercicios → todos pueden ver
    @GetMapping("/obtener")
    public List<Ejercicio> obtenerTodosLosEjercicios() {
        return ejercicioService.obtenerTodosLosEjercicios();
    }

    // Buscar ejercicio por nombre → todos pueden ver
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        Ejercicio ejercicio = ejercicioService.buscarPorNombre(nombre);
        if (ejercicio == null) {
            return ResponseEntity.status(404).body("Ejercicio no encontrado");
        }
        return ResponseEntity.ok(ejercicio);
    }
}
