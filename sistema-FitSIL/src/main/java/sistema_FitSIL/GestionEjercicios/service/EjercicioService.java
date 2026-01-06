package sistema_FitSIL.GestionEjercicios.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sistema_FitSIL.GestionEjercicios.model.Ejercicio;
import sistema_FitSIL.GestionEjercicios.repository.EjercicioRepository;



@Service
public class EjercicioService {

    @Autowired
    private EjercicioRepository ejercicioRepository;

    // Crear o actualizar un nuevo ejercicio
    public Ejercicio guardarEjercicio(Ejercicio ejercicio) {
        return ejercicioRepository.save(ejercicio);
    }

    // Obtener todos los ejercicios
    public List<Ejercicio> obtenerTodosLosEjercicios() {
        return ejercicioRepository.findAll();
    }

    // Buscar ejercicio por nombre
    public Ejercicio buscarPorNombre(String nombre) {
        return ejercicioRepository.findByNombre(nombre);
    }
    
}
