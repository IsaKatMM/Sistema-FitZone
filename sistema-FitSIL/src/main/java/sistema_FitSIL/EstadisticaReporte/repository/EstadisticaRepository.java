package sistema_FitSIL.EstadisticaReporte.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Repository;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Repository
public class EstadisticaRepository {
    private final String archivo = "data" + File.separator + "estadisticas.json";



    private final ObjectMapper mapper = new ObjectMapper();

    public List<Estadistica> obtenerTodas() {
        try {
            File file = new File(archivo);
            if (!file.exists()) return new ArrayList<>();
            return mapper.readValue(file, new TypeReference<List<Estadistica>>() {});
        } catch (IOException e) {
            throw new RuntimeException("Error leyendo el archivo JSON", e);
        }
    }

    public void guardarTodas(List<Estadistica> estadisticas) {
    try {
        File file = new File(archivo);
        
        // Crear la carpeta 'data' si no existe
        file.getParentFile().mkdirs();
        
        mapper.writerWithDefaultPrettyPrinter().writeValue(file, estadisticas);
    } catch (IOException e) {
        throw new RuntimeException("Error escribiendo el archivo JSON", e);
    }
}


    public void agregar(Estadistica nueva) {
        List<Estadistica> lista = obtenerTodas();
        lista.add(nueva);
        guardarTodas(lista);
    }
}
