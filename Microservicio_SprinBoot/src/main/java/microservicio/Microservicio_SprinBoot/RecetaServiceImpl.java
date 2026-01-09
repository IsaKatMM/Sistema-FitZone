package microservicio.Microservicio_SprinBoot;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
public class RecetaServiceImpl implements RecetaService {

    @Override
    public List<Recetas> obtenerRecetas() {
        return JsonUtil.leerRecetas();
    }

    @Override
    public Recetas obtenerRecetaPorId(Long id) {
        List<Recetas> recetas = JsonUtil.leerRecetas();
        return recetas.stream()
                .filter(r -> r.getId() == id)
                .findFirst()
                .orElse(null);
    }

    @Override
    public Recetas crearReceta(Recetas nuevaReceta) {
        List<Recetas> recetas = JsonUtil.leerRecetas();
        
        // Generar nuevo ID
        long nuevoId = recetas.stream()
                .mapToLong(Recetas::getId)
                .max()
                .orElse(0L) + 1;
        
        nuevaReceta.setId(nuevoId);
        recetas.add(nuevaReceta);
        
        JsonUtil.guardarRecetas(recetas);
        return nuevaReceta;
    }

    @Override
    public Recetas actualizarReceta(Long id, Recetas recetaActualizada) {
        List<Recetas> recetas = JsonUtil.leerRecetas();
        
        for (int i = 0; i < recetas.size(); i++) {
            if (recetas.get(i).getId() == id) {
                recetaActualizada.setId(id);
                recetas.set(i, recetaActualizada);
                JsonUtil.guardarRecetas(recetas);
                return recetaActualizada;
            }
        }
        
        return null;
    }

    @Override
    public boolean eliminarReceta(Long id) {
        List<Recetas> recetas = JsonUtil.leerRecetas();
        boolean eliminado = recetas.removeIf(r -> r.getId() == id);
        
        if (eliminado) {
            JsonUtil.guardarRecetas(recetas);
        }
        
        return eliminado;
    }

    @Override
    public List<Recetas> buscarPorNombre(String nombre) {
        List<Recetas> recetas = JsonUtil.leerRecetas();
        return recetas.stream()
                .filter(r -> r.getNombre().toLowerCase().contains(nombre.toLowerCase()))
                .collect(Collectors.toList());
    }
}