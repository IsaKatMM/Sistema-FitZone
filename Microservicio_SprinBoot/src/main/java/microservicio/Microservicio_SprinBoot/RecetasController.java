package microservicio.Microservicio_SprinBoot;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recetas")
@CrossOrigin(origins = "*")
public class RecetasController {

    private final RecetaService recetaService;

    public RecetasController(RecetaService recetaService) {
        this.recetaService = recetaService;
    }

    // ============================================
    // OBTENER TODAS - Todos pueden ver
    // ============================================
    @GetMapping
    public List<Recetas> obtenerRecetas() {
        return recetaService.obtenerRecetas();
    }

    // ============================================
    // OBTENER POR ID - Todos pueden ver
    // ============================================
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerRecetaPorId(@PathVariable Long id) {
        Recetas receta = recetaService.obtenerRecetaPorId(id);
        if (receta == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Receta no encontrada"));
        }
        return ResponseEntity.ok(receta);
    }

    // ============================================
    // CREAR - Solo Admin (verificar en frontend)
    // ============================================
    @PostMapping
    public ResponseEntity<?> crearReceta(@RequestBody Recetas receta) {
        try {
            Recetas nuevaReceta = recetaService.crearReceta(receta);
            return ResponseEntity.ok(nuevaReceta);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error al crear receta: " + e.getMessage()));
        }
    }

    // ============================================
    // ACTUALIZAR - Solo Admin (verificar en frontend)
    // ============================================
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarReceta(
            @PathVariable Long id,
            @RequestBody Recetas recetaActualizada) {
        try {
            Recetas receta = recetaService.actualizarReceta(id, recetaActualizada);
            if (receta == null) {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "Receta no encontrada"));
            }
            return ResponseEntity.ok(receta);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error al actualizar receta: " + e.getMessage()));
        }
    }

    // ============================================
    // ELIMINAR - Solo Admin (verificar en frontend)
    // ============================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReceta(@PathVariable Long id) {
        try {
            boolean eliminado = recetaService.eliminarReceta(id);
            if (!eliminado) {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "Receta no encontrada"));
            }
            return ResponseEntity.ok(Map.of(
                "mensaje", "Receta eliminada exitosamente",
                "id", id
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error al eliminar receta: " + e.getMessage()));
        }
    }

    // ============================================
    // BUSCAR POR NOMBRE - Todos pueden ver
    // ============================================
    @GetMapping("/buscar")
    public List<Recetas> buscarPorNombre(@RequestParam String nombre) {
        return recetaService.buscarPorNombre(nombre);
    }
}