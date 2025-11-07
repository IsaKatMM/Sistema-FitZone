package sistema_FitSIL.EstadisticaReporte.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sistema_FitSIL.EstadisticaReporte.model.Estadistica;
import java.util.List;

@Repository
public interface EstadisticaRepository extends JpaRepository<Estadistica, Long> {
    // Buscar todas las estadísticas por usuario
    List<Estadistica> findByIdUsuario(String idUsuario);
}
