package sistema_FitSIL.RutinaSemanal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import sistema_FitSIL.EstadisticaReporte.service.EstadisticaService;
import sistema_FitSIL.GestionUsuarios.model.Usuario;
import sistema_FitSIL.GestionUsuarios.service.UsuarioService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rutinas")
@CrossOrigin(origins = "*")
public class RutinaSemanalController {

    @Autowired
    private RutinaSemanalService rutinaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private EstadisticaService estadisticaService;

    /**
     * ✅ Agregar ejercicio a la rutina del usuario autenticado
     * POST /api/rutinas/agregar
     */
    @PostMapping("/agregar")
    public ResponseEntity<?> agregarEjercicio(
            @RequestBody Map<String, Object> datos,
            Authentication auth) {
        try {
            String correo = auth.getName();
            
            Integer ejercicioId = (Integer) datos.get("ejercicioId");
            String diaStr = (String) datos.get("dia");
            Integer series = (Integer) datos.get("series");
            Integer repeticiones = (Integer) datos.get("repeticiones");
            Double peso = datos.get("peso") != null ? ((Number) datos.get("peso")).doubleValue() : 0.0;
            String notas = (String) datos.get("notas");

            DiaSemana dia = DiaSemana.valueOf(diaStr.toUpperCase());

            RutinaSemanal rutina = rutinaService.agregarEjercicioARutina(
                    correo, ejercicioId, dia, series, repeticiones, peso
            );

            if (notas != null && !notas.isEmpty()) {
                rutina.setNotas(notas);
                rutinaService.actualizarRutina(rutina.getId(), null, null, null, null, notas);
            }

            // ✅ ESTANDARIZADO: Mismo formato que los otros endpoints
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Ejercicio agregado a la rutina correctamente",
                    "rutina", rutina
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Obtener todas las rutinas del usuario autenticado
     * GET /api/rutinas/usuario
     */
    @GetMapping("/usuario")
    public ResponseEntity<?> obtenerRutinasUsuario(Authentication auth) {
        try {
            String correo = auth.getName();
            List<RutinaSemanal> rutinas = rutinaService.obtenerRutinasPorUsuario(correo);
            return ResponseEntity.ok(rutinas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Obtener rutinas de un día específico
     * GET /api/rutinas/dia/{dia}
     */
    @GetMapping("/dia/{dia}")
    public ResponseEntity<?> obtenerRutinasPorDia(
            @PathVariable String dia,
            Authentication auth) {
        try {
            String correo = auth.getName();
            DiaSemana diaSemana = DiaSemana.valueOf(dia.toUpperCase());
            List<RutinaSemanal> rutinas = rutinaService.obtenerRutinasPorDia(correo, diaSemana);
            return ResponseEntity.ok(rutinas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ CORREGIDO: Toggle rutina completada (marcar/desmarcar) y generar estadística
     * PUT /api/rutinas/{id}/completar
     */
    @PutMapping("/{id}/completar")
    public ResponseEntity<?> toggleCompletado(
            @PathVariable Integer id,
            Authentication auth) {
        try {
            String correo = auth.getName();
            Usuario usuario = usuarioService.obtenerPerfil(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            // Verificar que la rutina pertenece al usuario
            RutinaSemanal rutina = rutinaService.obtenerRutinasPorUsuario(correo)
                    .stream()
                    .filter(r -> r.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Rutina no encontrada o no autorizada"));

            // ✅ Guardar estado ANTES del toggle
            boolean estadoAnterior = rutina.isCompletado();
            
            // ✅ Hacer el toggle (cambiar al estado opuesto)
            RutinaSemanal actualizada = rutinaService.toggleCompletado(id);
            
            // ✅ Obtener el NUEVO estado DESPUÉS del toggle
            boolean nuevoEstado = actualizada.isCompletado();
            
            System.out.println("📊 Toggle: " + estadoAnterior + " → " + nuevoEstado);
            
            // ✅ Solo generar estadística si cambió de false a true
            boolean estadisticaGenerada = false;
            if (nuevoEstado && !estadoAnterior) {
                int minutosEstimados = calcularMinutosEstimados(actualizada);
                estadisticaService.generarEstadisticaAutomatica(usuario, minutosEstimados);
                estadisticaGenerada = true;
                System.out.println("✅ Estadística generada: " + minutosEstimados + " minutos");
            }
            
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Rutina actualizada correctamente",
                    "rutina", actualizada,
                    "estadisticaGenerada", estadisticaGenerada
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Calcular minutos estimados de un ejercicio
     * Fórmula: (series * repeticiones * 3 seg) + (series * 60 seg descanso) / 60
     */
    private int calcularMinutosEstimados(RutinaSemanal rutina) {
        int series = rutina.getSeries() != null ? rutina.getSeries() : 3;
        int repeticiones = rutina.getRepeticiones() != null ? rutina.getRepeticiones() : 12;
        
        // Tiempo de ejecución: cada repetición toma ~3 segundos
        int segundosEjecucion = series * repeticiones * 3;
        
        // Tiempo de descanso: 60 segundos entre series
        int segundosDescanso = (series - 1) * 60;
        
        // Total en minutos
        int totalSegundos = segundosEjecucion + segundosDescanso;
        int minutos = Math.max(1, totalSegundos / 60); // Mínimo 1 minuto
        
        return minutos;
    }

    /**
     * ✅ Actualizar una rutina
     * PUT /api/rutinas/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarRutina(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> datos,
            Authentication auth) {
        try {
            String correo = auth.getName();

            // Verificar que la rutina pertenece al usuario
            rutinaService.obtenerRutinasPorUsuario(correo)
                    .stream()
                    .filter(r -> r.getId().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Rutina no encontrada o no autorizada"));

            DiaSemana nuevoDia = datos.get("dia") != null 
                    ? DiaSemana.valueOf(((String) datos.get("dia")).toUpperCase()) 
                    : null;
            Integer series = (Integer) datos.get("series");
            Integer repeticiones = (Integer) datos.get("repeticiones");
            Double peso = datos.get("peso") != null ? ((Number) datos.get("peso")).doubleValue() : null;
            String notas = (String) datos.get("notas");

            RutinaSemanal actualizada = rutinaService.actualizarRutina(
                    id, nuevoDia, series, repeticiones, peso, notas
            );

            // ✅ ESTANDARIZADO: Mismo formato
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Rutina actualizada correctamente",
                    "rutina", actualizada
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Eliminar una rutina
     * DELETE /api/rutinas/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarRutina(
            @PathVariable Integer id,
            Authentication auth) {
        try {
            String correo = auth.getName();
            rutinaService.eliminarRutina(id, correo);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Rutina eliminada exitosamente",
                    "id", id
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Eliminar todas las rutinas del usuario
     * DELETE /api/rutinas/usuario/todas
     */
    @DeleteMapping("/usuario/todas")
    public ResponseEntity<?> eliminarTodasLasRutinas(Authentication auth) {
        try {
            String correo = auth.getName();
            rutinaService.eliminarTodasLasRutinas(correo);
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Todas las rutinas eliminadas"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Obtener estadísticas de rutinas del usuario
     * GET /api/rutinas/estadisticas
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<?> obtenerEstadisticas(Authentication auth) {
        try {
            String correo = auth.getName();
            String estadisticas = rutinaService.obtenerEstadisticas(correo);
            return ResponseEntity.ok(estadisticas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Obtener rutinas completadas
     * GET /api/rutinas/completadas
     */
    @GetMapping("/completadas")
    public ResponseEntity<?> obtenerRutinasCompletadas(Authentication auth) {
        try {
            String correo = auth.getName();
            List<RutinaSemanal> completadas = rutinaService.obtenerRutinasCompletadas(correo);
            return ResponseEntity.ok(completadas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * ✅ Completar todas las rutinas de un día
     * POST /api/rutinas/completar-dia/{dia}
     */
    @PostMapping("/completar-dia/{dia}")
    public ResponseEntity<?> completarRutinasDia(
            @PathVariable String dia,
            Authentication auth) {
        try {
            String correo = auth.getName();
            Usuario usuario = usuarioService.obtenerPerfil(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            
            DiaSemana diaSemana = DiaSemana.valueOf(dia.toUpperCase());
            List<RutinaSemanal> rutinas = rutinaService.obtenerRutinasPorDia(correo, diaSemana);
            
            int totalMinutos = 0;
            int completadas = 0;
            
            for (RutinaSemanal rutina : rutinas) {
                if (!rutina.isCompletado()) {
                    rutinaService.toggleCompletado(rutina.getId());
                    totalMinutos += calcularMinutosEstimados(rutina);
                    completadas++;
                }
            }
            
            if (totalMinutos > 0) {
                estadisticaService.generarEstadisticaAutomatica(usuario, totalMinutos);
            }
            
            return ResponseEntity.ok(Map.of(
                    "mensaje", "Rutinas del día completadas",
                    "completadas", completadas,
                    "minutosTotal", totalMinutos
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}