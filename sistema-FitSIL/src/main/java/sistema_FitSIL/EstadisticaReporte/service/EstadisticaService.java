package sistema_FitSIL.EstadisticaReporte.service;

import org.springframework.stereotype.Service;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import sistema_FitSIL.EstadisticaReporte.repository.EstadisticaRepository;
import sistema_FitSIL.GestionEjercicios.service.EjercicioService;
import sistema_FitSIL.GestionUsuarios.model.Usuario;

import java.util.List;

@Service
public class EstadisticaService {

    private final EstadisticaRepository repo;
    private final EjercicioService ejercicioService;

    public EstadisticaService(EstadisticaRepository repo, EjercicioService ejercicioService) {
        this.repo = repo;
        this.ejercicioService = ejercicioService;
    }

    public List<Estadistica> listar() {
        return repo.findAll();
    }

    public void agregar(Estadistica e) {
        repo.save(e);
    }

    public List<Estadistica> buscarPorUsuario(Usuario usuario) {
        return repo.findByUsuario(usuario);
    }

    public double promedioEstres(Usuario usuario) {
        List<Estadistica> lista = buscarPorUsuario(usuario);
        return lista.stream().mapToDouble(Estadistica::getNivelEstres).average().orElse(0.0);
    }

    // 🔹 NUEVO: genera estadísticas automáticamente
    public Estadistica generarEstadisticaAutomatica(Usuario usuario, int minutosEjercicio) {
        double peso = usuario.getPeso();
        double caloriasQuemadas = minutosEjercicio * peso * 0.05;
        double nivelEstres = Math.max(0, 100 - (minutosEjercicio * 2)); // 0 a 100

        Estadistica e = new Estadistica(
                usuario,
                java.time.LocalDate.now().toString(),
                caloriasQuemadas,
                minutosEjercicio,
                nivelEstres
        );

        repo.save(e);
        return e;
    }
}
