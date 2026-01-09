package microservicio.Microservicio_SprinBoot;

public class Recetas {
    private long id;
    private String nombre;
    private String descripcion;
    private String imagenUrl;
    private String ingredientes;
    private String instrucciones;
    
    // Campos nutricionales adicionales
    private Integer calorias;
    private Integer proteinas;
    private Integer carbohidratos;
    private Integer grasas;
    
    // Campos adicionales
    private String categoria; // Desayuno, Almuerzo, Cena, Snack
    private Integer tiempoPreparacion; // en minutos
    private String dificultad; // Fácil, Media, Difícil

    // Constructor vacío
    public Recetas() {
    }

    // Constructor completo
    public Recetas(long id, String nombre, String descripcion, String imagenUrl, 
                   String ingredientes, String instrucciones, Integer calorias, 
                   Integer proteinas, Integer carbohidratos, Integer grasas,
                   String categoria, Integer tiempoPreparacion, String dificultad) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.ingredientes = ingredientes;
        this.instrucciones = instrucciones;
        this.calorias = calorias;
        this.proteinas = proteinas;
        this.carbohidratos = carbohidratos;
        this.grasas = grasas;
        this.categoria = categoria;
        this.tiempoPreparacion = tiempoPreparacion;
        this.dificultad = dificultad;
    }

    // Getters y Setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public String getIngredientes() { return ingredientes; }
    public void setIngredientes(String ingredientes) { this.ingredientes = ingredientes; }

    public String getInstrucciones() { return instrucciones; }
    public void setInstrucciones(String instrucciones) { this.instrucciones = instrucciones; }

    public Integer getCalorias() { return calorias; }
    public void setCalorias(Integer calorias) { this.calorias = calorias; }

    public Integer getProteinas() { return proteinas; }
    public void setProteinas(Integer proteinas) { this.proteinas = proteinas; }

    public Integer getCarbohidratos() { return carbohidratos; }
    public void setCarbohidratos(Integer carbohidratos) { this.carbohidratos = carbohidratos; }

    public Integer getGrasas() { return grasas; }
    public void setGrasas(Integer grasas) { this.grasas = grasas; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public Integer getTiempoPreparacion() { return tiempoPreparacion; }
    public void setTiempoPreparacion(Integer tiempoPreparacion) { this.tiempoPreparacion = tiempoPreparacion; }

    public String getDificultad() { return dificultad; }
    public void setDificultad(String dificultad) { this.dificultad = dificultad; }
}