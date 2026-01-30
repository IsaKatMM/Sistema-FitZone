// ========== NotificacionUsuarioController.java (NUEVO) ==========
package sistema_FitSIL.GestionUsuarios.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sistema_FitSIL.GestionUsuarios.model.Notificacion;
import sistema_FitSIL.GestionUsuarios.service.NotificacionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones-usuario")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyRole('USUARIO', 'ADMINISTRADOR')")  // ✅ Usuarios y admins
public class NotificacionUsuarioController {

    @Autowired
    private NotificacionService notificacionService;

    /**
     * ✅ Obtener notificaciones del usuario
     * GET /api/notificaciones-usuario
     */
    @GetMapping
    public ResponseEntity<?> obtenerNotificaciones(Authentication authentication) {
        try {
            // Por ahora obtener todas (después puedes filtrar por usuario)
            List<Notificacion> notificaciones = notificacionService.obtenerTodas();
            return ResponseEntity.ok(notificaciones);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al obtener notificaciones"));
        }
    }

    /**
     * ✅ Marcar notificación como leída
     * PUT /api/notificaciones-usuario/{id}/leer
     */
    @PutMapping("/{id}/leer")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long id) {
        try {
            Notificacion actualizada = notificacionService.marcarComoLeida(id);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al marcar como leída"));
        }
    }

    /**
     * ✅ Eliminar notificación
     * DELETE /api/notificaciones-usuario/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarNotificacion(@PathVariable Long id) {
        try {
            notificacionService.eliminarNotificacion(id);
            return ResponseEntity.ok(Map.of("mensaje", "Notificación eliminada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al eliminar notificación"));
        }
    }

    /**
     * ✅ Contar notificaciones no leídas
     * GET /api/notificaciones-usuario/no-leidas/contar
     */
    @GetMapping("/no-leidas/contar")
    public ResponseEntity<?> contarNoLeidas() {
        try {
            long cantidad = notificacionService.contarNoLeidas();
            return ResponseEntity.ok(Map.of("cantidad", cantidad));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al contar notificaciones"));
        }
    }

    /**
     * ✅ Marcar todas como leídas
     * PUT /api/notificaciones-usuario/leer-todas
     */
    @PutMapping("/leer-todas")
    public ResponseEntity<?> marcarTodasComoLeidas() {
        try {
            notificacionService.marcarTodasComoLeidas();
            return ResponseEntity.ok(Map.of("mensaje", "Todas marcadas como leídas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Error al marcar todas como leídas"));
        }
    }
}