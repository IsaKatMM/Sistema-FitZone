package sistema_FitSIL.GestionEjercicios.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Ejercicio {
    // Atributos del ejercicio
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nombre;
    private String descripcion;
    private String musculoTrabajado;

    // Construcctor vacío
    public Ejercicio() {
    }


    // Constructor
    public Ejercicio(int id, String nombre, String descripcion, String musculoTrabajado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.musculoTrabajado = musculoTrabajado;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    public String getMusculoTrabajado() {
        return musculoTrabajado;
    }
    public void setMusculoTrabajado(String musculoTrabajado) {
        this.musculoTrabajado = musculoTrabajado;
    }

}
