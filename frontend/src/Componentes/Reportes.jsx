import "./Reportes.css";

const reportes = [
  {
    titulo: "Reporte mensual",
    descripcion: "Resumen de entrenamientos y progreso",
  },
  {
    titulo: "Consumo de calorías",
    descripcion: "Detalle de calorías quemadas por semana",
  },
  {
    titulo: "Historial completo",
    descripcion: "Todas las actividades registradas",
  },
];

export default function Reportes() {
  return (
    <div className="reportes">
      {reportes.map((r, i) => (
        <div key={i} className="reporte-card">
          <h3>{r.titulo}</h3>
          <p>{r.descripcion}</p>
          <button>Ver reporte</button>
        </div>
      ))}
    </div>
  );
}
