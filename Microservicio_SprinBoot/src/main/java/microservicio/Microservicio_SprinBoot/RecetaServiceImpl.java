package microservicio.Microservicio_SprinBoot;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class RecetaServiceImpl implements RecetaService {

    @Override
    public List<Recetas> obtenerRecetas() {
        return JsonUtil.leerRecetas();
    }
}
