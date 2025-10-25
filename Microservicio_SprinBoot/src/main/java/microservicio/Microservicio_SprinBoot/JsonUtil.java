package microservicio.Microservicio_SprinBoot;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

public class JsonUtil {

    private static final String RUTA_JSON = "recetas.json";

    public static List<Recetas> leerRecetas() {
        try {
            // Primero intentar leer desde el classpath (resources)
            InputStream is = JsonUtil.class.getClassLoader().getResourceAsStream(RUTA_JSON);
            
            if (is != null) {
                System.out.println("✓ Archivo encontrado en classpath");
                InputStreamReader reader = new InputStreamReader(is);
                Type listType = new TypeToken<List<Recetas>>() {}.getType();
                List<Recetas> recetas = new Gson().fromJson(reader, listType);
                reader.close();
                System.out.println("✓ Recetas leídas: " + (recetas != null ? recetas.size() : 0));
                return recetas != null ? recetas : new ArrayList<>();
            }
            
            // Si no está en classpath, intentar ruta absoluta
            File file = new File(RUTA_JSON);
            System.out.println("Buscando en: " + file.getAbsolutePath());
            
            if (file.exists()) {
                System.out.println("✓ Archivo encontrado en ruta absoluta");
                FileReader reader = new FileReader(file);
                Type listType = new TypeToken<List<Recetas>>() {}.getType();
                List<Recetas> recetas = new Gson().fromJson(reader, listType);
                reader.close();
                System.out.println("✓ Recetas leídas: " + (recetas != null ? recetas.size() : 0));
                return recetas != null ? recetas : new ArrayList<>();
            }
            
            System.err.println("✗ Archivo no encontrado en ninguna ubicación");
            return new ArrayList<>();
            
        } catch (IOException e) {
            System.err.println("✗ Error al leer archivo JSON:");
            e.printStackTrace();
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("✗ Error al parsear JSON:");
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public static void guardarRecetas(List<Recetas> recetas) {
        try (FileWriter writer = new FileWriter(RUTA_JSON)) {
            new Gson().toJson(recetas, writer);
            System.out.println("✓ Recetas guardadas correctamente");
        } catch (IOException e) {
            System.err.println("✗ Error al guardar recetas:");
            e.printStackTrace();
        }
    }
}