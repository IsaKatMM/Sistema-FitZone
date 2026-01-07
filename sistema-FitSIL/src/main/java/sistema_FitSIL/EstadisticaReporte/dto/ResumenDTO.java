package sistema_FitSIL.EstadisticaReporte.dto;

public class ResumenDTO {

    private int entrenamientos;
    private int duracionPromedio;
    private double calorias;

    public ResumenDTO(int entrenamientos, int duracionPromedio, double calorias) {
        this.entrenamientos = entrenamientos;
        this.duracionPromedio = duracionPromedio;
        this.calorias = calorias;
    }

    public int getEntrenamientos() {
        return entrenamientos;
    }

    public int getDuracionPromedio() {
        return duracionPromedio;
    }

    public double getCalorias() {
        return calorias;
    }
}
