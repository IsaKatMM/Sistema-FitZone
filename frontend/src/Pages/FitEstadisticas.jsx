import EstadisticaCard from "../Componentes/EstadisticaCard";
import FiltroRango from "../Componentes/FiltroRango";
import GraficoLinea from "../Componentes/GraficoLinea";
import GraficoBarras from "../Componentes/GraficoBarras";
import ActividadReciente from "../Componentes/ActividadReciente";

export default function FitEstadisticas() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* HEADER */}
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold">Statistics</h1>
      </div>

      {/* RESUMEN */}
      <div className="flex flex-wrap gap-4 p-4">
        <EstadisticaCard titulo="Total Workouts" valor="28" />
        <EstadisticaCard titulo="Avg. Duration" valor="45 min" />
        <EstadisticaCard titulo="Calories Burned" valor="12,450" />
      </div>

      {/* FILTRO */}
      <div className="px-4">
        <FiltroRango />
      </div>

      {/* GRÁFICOS */}
      <div className="flex flex-col gap-6 p-4">
        <GraficoLinea />
        <GraficoBarras />
      </div>

      {/* ACTIVIDAD */}
      <h2 className="px-4 pt-2 pb-3 text-lg font-bold">
        Recent Activity
      </h2>

      <div className="px-4 pb-32">
        <ActividadReciente />
      </div>
    </div>
  );
}
