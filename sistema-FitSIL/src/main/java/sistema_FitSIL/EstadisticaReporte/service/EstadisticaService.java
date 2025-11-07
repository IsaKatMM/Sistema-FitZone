package sistema_FitSIL.EstadisticaReporte.service;

import org.springframework.stereotype.Service;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import sistema_FitSIL.EstadisticaReporte.repository.EstadisticaRepository;

import java.util.List;

@Service
public class EstadisticaService {

    private final EstadisticaRepository repo;

    public EstadisticaService(EstadisticaRepository repo) {
        this.repo = repo;
    }

    public List<Estadistica> listar() {
        return repo.findAll();
    }

    public void agregar(Estadistica e) {
        repo.save(e);
    }

    public List<Estadistica> buscarPorUsuario(String idUsuario) {
        return repo.findByIdUsuario(idUsuario);
    }

    public double promedioEstres(String idUsuario) {
        List<Estadistica> lista = buscarPorUsuario(idUsuario);
        return lista.stream().mapToDouble(Estadistica::getNivelEstres).average().orElse(0.0);
    }
}
