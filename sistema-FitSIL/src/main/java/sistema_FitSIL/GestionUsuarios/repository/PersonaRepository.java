package sistema_FitSIL.GestionUsuarios.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import sistema_FitSIL.GestionUsuarios.model.Persona;

@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {

    Persona findByUsuario(String usuario);  
    
}
