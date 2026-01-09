import { useEffect, useState } from "react";
import FiltroRango from "../Componentes/FiltroRango";
import EstadisticaCard from "../Componentes/EstadisticaCard";
import GraficoLinea from "../Componentes/GraficoLinea";
import GraficoBarras from "../Componentes/GraficoBarras";
import ActividadReciente from "../Componentes/ActividadReciente";
import { EstadisticaService } from "../Service/EstadisticaService";

export default function FitEstadisticas() {
  const [rango, setRango] = useState("1M");
  const [estadisticas, setEstadisticas] = useState([]);
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    EstadisticaService.obtenerPorUsuario().then(setEstadisticas);
    EstadisticaService.obtenerResumen(rango).then(setResumen);
  }, [rango]);

  return (
    <>
      <FiltroRango rango={rango} setRango={setRango} />

      <div className="estadisticas-grid">
        <EstadisticaCard
          titulo="Entrenamientos totales"
          valor={resumen?.totalEntrenamientos ?? 0}
        />
        <EstadisticaCard
          titulo="Duración promedio"
          valor={`${resumen?.promedioMinutos ?? 0} min`}
        />
        <EstadisticaCard
          titulo="Calorías quemadas"
          valor={`${resumen?.totalCalorias ?? 0} kcal`}
        />
      </div>

      <div className="graficos-grid">
        <GraficoLinea estadisticas={estadisticas} rango={rango} />
        <GraficoBarras estadisticas={estadisticas} rango={rango} />
      </div>

      <ActividadReciente estadisticas={estadisticas} />
    </>
  );
}
