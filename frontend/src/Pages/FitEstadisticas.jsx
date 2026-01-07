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

  // 🔒 Estado inicial BLINDADO
  const [resumen, setResumen] = useState({
    entrenamientos: 0,
    duracionPromedio: 0,
    calorias: 0,
  });

  useEffect(() => {
    let nuevoResumen;

    switch (rango) {
      case "7D":
        nuevoResumen = {
          entrenamientos: 6,
          duracionPromedio: 42,
          calorias: 3200,
        };
        break;

      case "1M":
        nuevoResumen = {
          entrenamientos: 28,
          duracionPromedio: 45,
          calorias: 12450,
        };
        break;

      case "6M":
        nuevoResumen = {
          entrenamientos: 120,
          duracionPromedio: 50,
          calorias: 54000,
        };
        break;

      default:
        nuevoResumen = {
          entrenamientos: 200,
          duracionPromedio: 48,
          calorias: 80000,
        };
    }

    setResumen(nuevoResumen);
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
          valor={(resumen.calorias ?? 0).toLocaleString()}
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
