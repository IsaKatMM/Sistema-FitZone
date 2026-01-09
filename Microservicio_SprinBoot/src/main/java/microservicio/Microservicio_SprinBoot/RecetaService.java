package microservicio.Microservicio_SprinBoot;

import java.util.List;

public interface RecetaService {

    List<Recetas> obtenerRecetas();

    Recetas obtenerRecetaPorId(Long id);

    Recetas crearReceta(Recetas nuevaReceta);

    Recetas actualizarReceta(Long id, Recetas recetaActualizada);

    boolean eliminarReceta(Long id);

    List<Recetas> buscarPorNombre(String nombre);
}
