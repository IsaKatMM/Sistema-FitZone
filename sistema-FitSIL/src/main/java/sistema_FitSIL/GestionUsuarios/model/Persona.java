package sistema_FitSIL.GestionUsuarios.model;

import jakarta.persistence.*;
<<<<<<< HEAD
import sistema_FitSIL.GestionUsuarios.util.Sanitizer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

=======
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank
    @Size(min = 3, max = 50)
    private String nombre;

    private String apellido;
    private String telefono;

    @NotBlank(message = "Correo obligatorio")
    @Email(message = "Correo inválido")
    private String correo;

     @NotBlank(message = "El nombre de usuario es obligatorio")
    @Size(min = 3, max = 20, message = "El usuario debe tener entre 3 y 20 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Usuario solo puede contener letras, números y guiones bajos")
    private String usuario;

    private String contrasenia;

    @Enumerated(EnumType.STRING)
<<<<<<< HEAD
    private Rol rol;

    public Persona() { }

    // Getters y setters con sanitización
    public void setNombre(String nombre) {
        if (nombre != null) this.nombre = Sanitizer.sanitize(nombre);
    }

    public void setApellido(String apellido) {
        if (apellido != null) this.apellido = Sanitizer.sanitize(apellido);
=======
    private Rol rol; // 👈 Nuevo campo

    public Persona() {
    }

    public Persona(Integer id, String nombre, String apellido, String telefono,
                   String correo, String usuario, String contrasena, Rol rol) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.correo = correo;
        this.usuario = usuario;
        this.contrasenia = contrasena;
        this.rol = rol;
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
    }

    public void setTelefono(String telefono) {
        if (telefono != null) this.telefono = telefono.replaceAll("[^0-9+\\s]", "").trim();
    }

    public void setCorreo(String correo) {
        if (correo != null) {
            correo = correo.trim();
            if (!correo.matches("^[A-Za-z0-9+_.-]+@(.+)$"))
                throw new IllegalArgumentException("Correo inválido");
            this.correo = correo;
        }
    }

    public void setUsuario(String usuario) {
        if (usuario != null) this.usuario = Sanitizer.sanitize(usuario);
    }

    public void setContrasenia(String contrasenia) {
        if (contrasenia != null) {
            if (contrasenia.length() < 6 || contrasenia.length() > 100)
                throw new IllegalArgumentException("Contraseña inválida");
            this.contrasenia = contrasenia; // será cifrada en Service
        }
    }

    // Resto de getters y setters


     public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

   

    public String getApellido() {
        return this.apellido;
    }

 

    public String getTelefono() {
        return this.telefono;
    }

  
    public String getCorreo() {
        return this.correo;
    }

   
    public String getUsuario() {
        return this.usuario;
    }

   

    public String getContrasenia() {
        return this.contrasenia;
    }

   
    public Rol getRol() {
        return this.rol;
    }

<<<<<<< HEAD
=======
    public Rol getRol() {
        return this.rol;
    }

>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
    public void setRol(Rol rol) {
        this.rol = rol;
    }

<<<<<<< HEAD
=======
    
>>>>>>> 5303c6a (comit in apis - gestionUusuarios and json)
}
