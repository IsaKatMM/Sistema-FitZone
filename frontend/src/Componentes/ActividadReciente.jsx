import "./ActividadReciente.css";

export default function ActividadReciente({ estadisticas }) {
  const recientes = [...estadisticas]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  return (
    <div className="actividad">
      {recientes.map((a, i) => (
        <div key={i} className="actividad-item">
          <div>
            <strong>Entrenamiento</strong>
            <p>{a.fecha}</p>
          </div>
          <span>{a.minutosEjercicio} min</span>
        </div>
      ))}
    </div>
  );
}
