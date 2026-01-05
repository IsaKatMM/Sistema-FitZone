import "./FitEstadisticas.css";
import EstadisticaCard from "../Componentes/EstadisticaCard";
import FiltroRango from "../Componentes/FiltroRango";
import GraficoLinea from "../Componentes/GraficoLinea";
import GraficoBarras from "../Componentes/GraficoBarras";
import ActividadReciente from "../Componentes/ActividadReciente";
import Reportes from "../Componentes/Reportes";


export default function FitEstadisticas() {
  return (
    <div className="page">
      <h1>Estadisticas/Reportes</h1>

      <div className="stats">
        <EstadisticaCard titulo="Entrenamientos totales" valor="28" />
        <EstadisticaCard titulo="Promedio Duración" valor="45 min" />
        <EstadisticaCard titulo="Calorias quemadas" valor="12,450" />
      </div>

      <FiltroRango />

      <div className="graficos">
        <GraficoLinea />
        <GraficoBarras />
      </div>

      <h2>Actividad reciente</h2>
      <ActividadReciente />

      <h2>Reportes</h2>
      <Reportes />

    </div>
  );
}
