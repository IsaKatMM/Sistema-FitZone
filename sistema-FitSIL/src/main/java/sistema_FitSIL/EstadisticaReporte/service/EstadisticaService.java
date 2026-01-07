package sistema_FitSIL.EstadisticaReporte.service;

import org.springframework.stereotype.Service;
import sistema_FitSIL.EstadisticaReporte.dto.ResumenDTO;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import sistema_FitSIL.EstadisticaReporte.repository.EstadisticaRepository;
import sistema_FitSIL.GestionUsuarios.model.Usuario;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadisticaService {

    private final EstadisticaRepository repo;

    public EstadisticaService(EstadisticaRepository repo) {
        this.repo = repo;
    }

    public List<Estadistica> listar() {
        return repo.findAll();
    }

    public List<Estadistica> buscarPorUsuario(Usuario usuario) {
        return repo.findByUsuario(usuario);
    }

    public double promedioEstres(Usuario usuario) {
        return buscarPorUsuario(usuario)
                .stream()
                .mapToDouble(Estadistica::getNivelEstres)
                .average()
                .orElse(0);
    }

    // 🔹 Generar estadística automática
    public Estadistica generarEstadisticaAutomatica(Usuario usuario, int minutos) {
        double calorias = minutos * usuario.getPeso() * 0.05;
        double estres = Math.max(0, 100 - minutos * 2);

        Estadistica e = new Estadistica(
                usuario,
                LocalDate.now().toString(),
                calorias,
                minutos,
                estres
        );

        return repo.save(e);
    }

    // 🔹 Resumen por rango
    public ResumenDTO obtenerResumen(Usuario usuario, String rango) {

        List<Estadistica> lista = filtrarPorRango(
                buscarPorUsuario(usuario),
                rango
        );

        int entrenamientos = lista.size();

        int duracionPromedio = entrenamientos == 0
                ? 0
                : (int) lista.stream()
                    .mapToInt(Estadistica::getMinutosEjercicio)
                    .average()
                    .orElse(0);

        double calorias = lista.stream()
                .mapToDouble(Estadistica::getCaloriasQuemadas)
                .sum();

        return new ResumenDTO(entrenamientos, duracionPromedio, calorias);
    }

    // 🔹 Filtro por rango
    private List<Estadistica> filtrarPorRango(List<Estadistica> lista, String rango) {

        LocalDate hoy = LocalDate.now();
        LocalDate desde;

        switch (rango) {
            case "7D":
                desde = hoy.minusDays(7);
                break;
            case "1M":
                desde = hoy.minusMonths(1);
                break;
            case "6M":
                desde = hoy.minusMonths(6);
                break;
            default:
                return lista;
        }

        return lista.stream()
                .filter(e -> LocalDate.parse(e.getFecha()).isAfter(desde))
                .collect(Collectors.toList());
    }
}
