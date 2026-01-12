package microservicio.Microservicio_SprinBoot;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

public class JsonUtil {

    private static final String RUTA_JSON = "recetas.json";
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    public static List<Recetas> leerRecetas() {
        System.out.println("========================================");
        System.out.println("📖 Intentando leer recetas.json");
        System.out.println("========================================");
        
        try {
            // 1. Primero intentar leer desde el directorio de trabajo
            File fileLocal = new File(RUTA_JSON);
            System.out.println("🔍 Buscando en directorio de trabajo: " + fileLocal.getAbsolutePath());
            
            if (fileLocal.exists()) {
                System.out.println("✅ Archivo encontrado en directorio de trabajo");
                try (FileReader reader = new FileReader(fileLocal)) {
                    Type listType = new TypeToken<List<Recetas>>() {}.getType();
                    List<Recetas> recetas = gson.fromJson(reader, listType);
                    System.out.println("✅ Recetas cargadas exitosamente: " + (recetas != null ? recetas.size() : 0));
                    System.out.println("========================================");
                    return recetas != null ? recetas : new ArrayList<>();
                }
            }
            
            // 2. Intentar leer desde classpath (resources)
            System.out.println("🔍 Buscando en classpath (resources)...");
            InputStream is = JsonUtil.class.getClassLoader().getResourceAsStream(RUTA_JSON);
            
            if (is != null) {
                System.out.println("✅ Archivo encontrado en classpath");
                try (InputStreamReader reader = new InputStreamReader(is)) {
                    Type listType = new TypeToken<List<Recetas>>() {}.getType();
                    List<Recetas> recetas = gson.fromJson(reader, listType);
                    System.out.println("✅ Recetas cargadas exitosamente: " + (recetas != null ? recetas.size() : 0));
                    System.out.println("========================================");
                    return recetas != null ? recetas : new ArrayList<>();
                }
            }
            
            System.err.println("❌ No se encontró recetas.json en ninguna ubicación");
            System.err.println("Ubicaciones buscadas:");
            System.err.println("  1. " + fileLocal.getAbsolutePath());
            System.err.println("  2. src/main/resources/" + RUTA_JSON);
            System.out.println("========================================");
            return new ArrayList<>();
            
        } catch (IOException e) {
            System.err.println("❌ Error al leer archivo JSON:");
            e.printStackTrace();
            System.out.println("========================================");
            return new ArrayList<>();
        } catch (Exception e) {
            System.err.println("❌ Error al parsear JSON:");
            e.printStackTrace();
            System.out.println("========================================");
            return new ArrayList<>();
        }
    }

    public static void guardarRecetas(List<Recetas> recetas) {
        System.out.println("========================================");
        System.out.println("💾 Guardando recetas en JSON");
        System.out.println("========================================");
        
        try {
            File file = new File(RUTA_JSON);
            System.out.println("📝 Guardando en: " + file.getAbsolutePath());
            
            try (FileWriter writer = new FileWriter(file)) {
                gson.toJson(recetas, writer);
                System.out.println("✅ " + recetas.size() + " recetas guardadas correctamente");
                System.out.println("========================================");
            }
        } catch (IOException e) {
            System.err.println("❌ Error al guardar recetas:");
            e.printStackTrace();
            System.out.println("========================================");
        }
    }
    
    // Método auxiliar para verificar si el archivo existe
    public static boolean archivoExiste() {
        File file = new File(RUTA_JSON);
        boolean existe = file.exists();
        System.out.println(existe ? "✅ recetas.json existe" : "❌ recetas.json NO existe");
        return existe;
    }
}