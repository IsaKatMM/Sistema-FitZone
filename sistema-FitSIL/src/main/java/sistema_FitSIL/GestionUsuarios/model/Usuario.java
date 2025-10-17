package sistema_FitSIL.GestionUsuarios.model;

public class Usuario {
    private Integer id;
    private double peso;
    private double altura;

    public Usuario() {
    }
    
    public Usuario(Integer id, double peso, double altura) {
        this.id = id;
        this.peso = peso;
        this.altura = altura;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public double getPeso() {
        return this.peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }

    public double getAltura() {
        return this.altura;
    }

    public void setAltura(double altura) {
        this.altura = altura;
    }

}
