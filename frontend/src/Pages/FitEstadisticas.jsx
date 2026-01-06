import { useEffect, useState } from "react";
import "./FitEstadisticas.css";

import EstadisticaCard from "../Componentes/EstadisticaCard";
import FiltroRango from "../Componentes/FiltroRango";
import GraficoLinea from "../Componentes/GraficoLinea";
import GraficoBarras from "../Componentes/GraficoBarras";
import ActividadReciente from "../Componentes/ActividadReciente";
import Reportes from "../Componentes/Reportes";

export default function FitEstadisticas() {
  const [rango, setRango] = useState("1M");

  // Datos simulados (luego vienen del backend)
  const [resumen, setResumen] = useState({
    entrenamientos: 28,
    duracionPromedio: 45,
    calorias: 12450,
  });

  useEffect(() => {
    // Aquí luego irá la llamada real al backend
    if (rango === "7D") {
      setResumen({ entrenamientos: 6, duracionPromedio: 42, calorias: 3200 });
    } else if (rango === "1M") {
      setResumen({ entrenamientos: 28, duracionPromedio: 45, calorias: 12450 });
    } else if (rango === "6M") {
      setResumen({ entrenamientos: 120, duracionPromedio: 50, calorias: 54000 });
    } else {
      setResumen({ entrenamientos: 200, duracionPromedio: 48, calorias: 80000 });
    }
  }, [rango]);

  return (
    <div className="page">
      <h1 className="titulo">Estadísticas y Reportes</h1>

      <div className="stats">
        <EstadisticaCard
          titulo="Entrenamientos totales"
          valor={resumen.entrenamientos}
        />
        <EstadisticaCard
          titulo="Duración promedio"
          valor={`${resumen.duracionPromedio} min`}
        />
        <EstadisticaCard
          titulo="Calorías quemadas"
          valor={resumen.calorias.toLocaleString()}
        />
      </div>

      <FiltroRango rango={rango} setRango={setRango} />

      <div className="graficos">
        <GraficoLinea rango={rango} />
        <GraficoBarras rango={rango} />
      </div>

      <h2>Actividad reciente</h2>
      <ActividadReciente />

      <h2>Reportes</h2>
      <Reportes />
    </div>
  );
}
