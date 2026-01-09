package sistema_FitSIL.GestionEjercicios.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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

    // ============================================
    // CREAR - Solo Admin
    // ============================================
    @PostMapping("/guardar")
    public ResponseEntity<?> guardarEjercicio(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam String musculoTrabajado,
            @RequestParam(required = false) MultipartFile imagen,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ROLE_ADMINISTRADOR"));

        if (!isAdmin) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Acceso denegado: solo administradores pueden crear ejercicios"));
        }

        Ejercicio ejercicio = new Ejercicio();
        ejercicio.setNombre(nombre);
        ejercicio.setDescripcion(descripcion);
        ejercicio.setMusculoTrabajado(musculoTrabajado);

        if (imagen != null && !imagen.isEmpty()) {
            try {
                String carpeta = "imagenes_ejercicios/";
                String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                Path rutaArchivo = Paths.get(carpeta + nombreArchivo);
                Files.createDirectories(rutaArchivo.getParent());
                imagen.transferTo(rutaArchivo.toFile());

                ejercicio.setImagenUrl(rutaArchivo.toString());
            } catch (Exception e) {
                return ResponseEntity.status(500)
                        .body(Map.of("error", "Error al guardar la imagen: " + e.getMessage()));
            }
        }

        Ejercicio guardado = ejercicioService.guardarEjercicio(ejercicio);
        return ResponseEntity.ok(guardado);
    }

    // ============================================
    // ACTUALIZAR - Solo Admin
    // ============================================
    @PutMapping("/actualizar/{id}")
    public ResponseEntity<?> actualizarEjercicio(
            @PathVariable Integer id,
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam String musculoTrabajado,
            @RequestParam(required = false) MultipartFile imagen,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ROLE_ADMINISTRADOR"));

        if (!isAdmin) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Acceso denegado: solo administradores pueden actualizar ejercicios"));
        }

        Ejercicio ejercicio = ejercicioService.obtenerEjercicioPorId(id);
        if (ejercicio == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Ejercicio no encontrado"));
        }

        ejercicio.setNombre(nombre);
        ejercicio.setDescripcion(descripcion);
        ejercicio.setMusculoTrabajado(musculoTrabajado);

        // Si se envió una nueva imagen, actualizarla
        if (imagen != null && !imagen.isEmpty()) {
            try {
                // Eliminar imagen anterior si existe
                if (ejercicio.getImagenUrl() != null) {
                    Path imagenAnterior = Paths.get(ejercicio.getImagenUrl());
                    Files.deleteIfExists(imagenAnterior);
                }

                // Guardar nueva imagen
                String carpeta = "imagenes_ejercicios/";
                String nombreArchivo = System.currentTimeMillis() + "_" + imagen.getOriginalFilename();
                Path rutaArchivo = Paths.get(carpeta + nombreArchivo);
                Files.createDirectories(rutaArchivo.getParent());
                imagen.transferTo(rutaArchivo.toFile());

                ejercicio.setImagenUrl(rutaArchivo.toString());
            } catch (Exception e) {
                return ResponseEntity.status(500)
                        .body(Map.of("error", "Error al actualizar la imagen: " + e.getMessage()));
            }
        }

        Ejercicio actualizado = ejercicioService.guardarEjercicio(ejercicio);
        return ResponseEntity.ok(actualizado);
    }

    // ============================================
    // ELIMINAR - Solo Admin
    // ============================================
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<?> eliminarEjercicio(
            @PathVariable Integer id,
            Authentication auth) {

        boolean isAdmin = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(r -> r.equals("ROLE_ADMINISTRADOR"));

        if (!isAdmin) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "Acceso denegado: solo administradores pueden eliminar ejercicios"));
        }

        Ejercicio ejercicio = ejercicioService.obtenerEjercicioPorId(id);
        if (ejercicio == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Ejercicio no encontrado"));
        }

        // Eliminar imagen si existe
        try {
            if (ejercicio.getImagenUrl() != null) {
                Path imagenPath = Paths.get(ejercicio.getImagenUrl());
                Files.deleteIfExists(imagenPath);
            }
        } catch (Exception e) {
            System.err.println("Error al eliminar imagen: " + e.getMessage());
        }

        ejercicioService.eliminarEjercicio(id);
        
        // Devolver JSON en lugar de texto plano
        return ResponseEntity.ok(Map.of(
            "mensaje", "Ejercicio eliminado exitosamente",
            "id", id
        ));
    }

    // ============================================
    // OBTENER TODOS - Todos pueden ver
    // ============================================
    @GetMapping("/obtener")
    public List<Ejercicio> obtenerTodosLosEjercicios() {
        return ejercicioService.obtenerTodosLosEjercicios();
    }

    // ============================================
    // BUSCAR POR NOMBRE - Todos pueden ver
    // ============================================
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorNombre(@RequestParam String nombre) {
        Ejercicio ejercicio = ejercicioService.buscarPorNombre(nombre);
        if (ejercicio == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("error", "Ejercicio no encontrado"));
        }
        return ResponseEntity.ok(ejercicio);
    }
}