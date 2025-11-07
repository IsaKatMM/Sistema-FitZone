package sistema_FitSIL.EstadisticaReporte.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "estadisticas")
public class Estadistica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Nuevo campo ID autogenerado

    private String idUsuario;
    private String fecha;
    private double caloriasQuemadas;
    private int minutosEjercicio;
    private double nivelEstres;

    public Estadistica() {}

    public Estadistica(String idUsuario, String fecha, double caloriasQuemadas, int minutosEjercicio, double nivelEstres) {
        this.idUsuario = idUsuario;
        this.fecha = fecha;
        this.caloriasQuemadas = caloriasQuemadas;
        this.minutosEjercicio = minutosEjercicio;
        this.nivelEstres = nivelEstres;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public double getCaloriasQuemadas() { return caloriasQuemadas; }
    public void setCaloriasQuemadas(double caloriasQuemadas) { this.caloriasQuemadas = caloriasQuemadas; }

    public int getMinutosEjercicio() { return minutosEjercicio; }
    public void setMinutosEjercicio(int minutosEjercicio) { this.minutosEjercicio = minutosEjercicio; }

    public double getNivelEstres() { return nivelEstres; }
    public void setNivelEstres(double nivelEstres) { this.nivelEstres = nivelEstres; }
}
