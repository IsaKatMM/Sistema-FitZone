package sistema_FitSIL.GestionEjercicios.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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

    // Crear o actualizar un ejercicio → solo admin
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
                    .body("Acceso denegado: solo administradores pueden crear ejercicios");
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
                return ResponseEntity.status(500).body("Error al guardar la imagen: " + e.getMessage());
            }
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
