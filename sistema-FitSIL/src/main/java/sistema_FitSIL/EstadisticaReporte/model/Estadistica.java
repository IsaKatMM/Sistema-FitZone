package sistema_FitSIL.EstadisticaReporte.model;

public class Estadistica {
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
