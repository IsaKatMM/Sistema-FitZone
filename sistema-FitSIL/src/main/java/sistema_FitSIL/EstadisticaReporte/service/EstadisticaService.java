package sistema_FitSIL.EstadisticaReporte.service;

import org.springframework.stereotype.Service;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import sistema_FitSIL.EstadisticaReporte.repository.EstadisticaRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadisticaService {

    private final EstadisticaRepository repo;

    public EstadisticaService(EstadisticaRepository repo) {
        this.repo = repo;
    }

    public List<Estadistica> listar() {
        return repo.obtenerTodas();
    }

    public void agregar(Estadistica e) {
        repo.agregar(e);
    }

    public List<Estadistica> buscarPorUsuario(String idUsuario) {
        return repo.obtenerTodas()
                   .stream()
                   .filter(e -> e.getIdUsuario().equals(idUsuario))
                   .collect(Collectors.toList());
    }

    public double promedioEstres(String idUsuario) {
        List<Estadistica> lista = buscarPorUsuario(idUsuario);
        return lista.stream().mapToDouble(Estadistica::getNivelEstres).average().orElse(0.0);
    }
}
