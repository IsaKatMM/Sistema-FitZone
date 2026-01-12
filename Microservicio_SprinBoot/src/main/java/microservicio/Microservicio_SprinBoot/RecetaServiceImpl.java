package microservicio.Microservicio_SprinBoot;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class RecetaServiceImpl implements RecetaService {

    @Override
    public List<Recetas> obtenerRecetas() {
        System.out.println("📋 Obteniendo todas las recetas");
        return JsonUtil.leerRecetas();
    }

    @Override
    public Recetas obtenerRecetaPorId(Long id) {
        System.out.println("🔍 Buscando receta con ID: " + id);
        List<Recetas> recetas = JsonUtil.leerRecetas();
        return recetas.stream()
                .filter(r -> r.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public Recetas crearReceta(Recetas nuevaReceta) {
        System.out.println("========================================");
        System.out.println("➕ Creando nueva receta");
        System.out.println("Nombre: " + nuevaReceta.getNombre());
        System.out.println("Tiempo: " + nuevaReceta.getTiempoPreparacion() + " min");
        System.out.println("========================================");
        
        List<Recetas> recetas = JsonUtil.leerRecetas();
        
        // Generar nuevo ID
        long nuevoId = recetas.stream()
                .mapToLong(Recetas::getId)
                .max()
                .orElse(0L) + 1;
        
        nuevaReceta.setId(nuevoId);
        recetas.add(nuevaReceta);
        
        JsonUtil.guardarRecetas(recetas);
        
        System.out.println("✅ Receta creada con ID: " + nuevoId);
        return nuevaReceta;
    }

    @Override
    public Recetas actualizarReceta(Long id, Recetas recetaActualizada) {
        System.out.println("========================================");
        System.out.println("✏️ Actualizando receta con ID: " + id);
        System.out.println("Nombre: " + recetaActualizada.getNombre());
        System.out.println("Tiempo recibido: " + recetaActualizada.getTiempoPreparacion() + " min");
        System.out.println("========================================");
        
        List<Recetas> recetas = JsonUtil.leerRecetas();
        
        for (int i = 0; i < recetas.size(); i++) {
            if (recetas.get(i).getId() == id) {
                recetaActualizada.setId(id);
                recetas.set(i, recetaActualizada);
                
                JsonUtil.guardarRecetas(recetas);
                
                System.out.println("✅ Receta actualizada correctamente");
                System.out.println("Tiempo guardado: " + recetaActualizada.getTiempoPreparacion() + " min");
                System.out.println("========================================");
                
                return recetaActualizada;
            }
        }
        
        System.err.println("❌ No se encontró la receta con ID: " + id);
        System.out.println("========================================");
        return null;
    }

    @Override
    public boolean eliminarReceta(Long id) {
        System.out.println("========================================");
        System.out.println("🗑️ Eliminando receta con ID: " + id);
        System.out.println("========================================");
        
        List<Recetas> recetas = JsonUtil.leerRecetas();
        boolean eliminado = recetas.removeIf(r -> r.getId() == id);
        
        if (eliminado) {
            JsonUtil.guardarRecetas(recetas);
            System.out.println("✅ Receta eliminada correctamente");
        } else {
            System.err.println("❌ No se encontró la receta con ID: " + id);
        }
        
        System.out.println("========================================");
        return eliminado;
    }

    @Override
    public List<Recetas> buscarPorNombre(String nombre) {
        System.out.println("🔎 Buscando recetas con nombre: " + nombre);
        List<Recetas> recetas = JsonUtil.leerRecetas();
        return recetas.stream()
                .filter(r -> r.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .collect(Collectors.toList());
    }
}