package sistema_FitSIL.GestionUsuarios.model;

public class Administrador {
    private Integer id;
    private String departamento;
    private int codigoAdmin;

    public Administrador() {
    }

    public Administrador(Integer id, String departamento, int codigoAdmin) {
        this.id = id;
        this.departamento = departamento;
        this.codigoAdmin = codigoAdmin;
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDepartamento() {
        return this.departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public int getCodigoAdmin() {
        return this.codigoAdmin;
    }

    public void setCodigoAdmin(int codigoAdmin) {
        this.codigoAdmin = codigoAdmin;
    }
    
}
