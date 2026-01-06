package sistema_FitSIL.GestionUsuarios.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sistema_FitSIL.GestionUsuarios.model.Persona;
import sistema_FitSIL.GestionUsuarios.repository.PersonaRepository;


@Service


public class PersonaService {
    
    @Autowired
    private PersonaRepository PersonaRepository;

    // Crear o actualizar un nuevo ejercicio
    public Persona guardarPersona(Persona persona) {
        return PersonaRepository.save(persona);
    }

    // Obtener todos las personas
    public List<Persona> obtenerTodosLasPersonas() {
        return PersonaRepository.findAll();
    }


}
