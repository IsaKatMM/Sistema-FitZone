import "./Reportes.css";

const reportes = [
  {
    titulo: "Reporte mensual",
    descripcion: "Resumen de entrenamientos y progreso",
    tipo: "mensual",
  },
  {
    titulo: "Consumo de calorías",
    descripcion: "Detalle de calorías quemadas por semana",
    tipo: "calorias",
  },
  {
    titulo: "Historial completo",
    descripcion: "Todas las actividades registradas",
    tipo: "historial",
  },
];

export default function Reportes() {
  const verReporte = (tipo) => {
    alert(`Generando reporte: ${tipo}`);
  };

  return (
    <div className="reportes">
      {reportes.map((r, i) => (
        <div key={i} className="reporte-card">
          <h3>{r.titulo}</h3>
          <p>{r.descripcion}</p>
          <button onClick={() => verReporte(r.tipo)}>
            Ver reporte
          </button>
        </div>
      ))}
    </div>
  );
}
