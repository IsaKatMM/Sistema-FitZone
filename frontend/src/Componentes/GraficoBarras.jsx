import "./Graficos.css";

export default function GraficoBarras({ rango }) {
  const datos = {
    "7D": [40, 60, 30, 80, 50, 20, 70],
    "1M": [60, 50, 40, 70, 80, 60, 90],
    "6M": [30, 40, 50, 60, 70, 80, 90],
    "ALL": [50, 50, 50, 50, 50, 50, 50],
  };

  const dias = ["L", "M", "M", "J", "V", "S", "D"];
  const valores = datos[rango];

  return (
    <div className="grafico-card">
      <h3>Volumen de entrenamiento ({rango})</h3>
      <p className="valor">
        {valores.reduce((a, b) => a + b, 0)} repeticiones
      </p>

      <div className="barras">
        {valores.map((v, i) => (
          <div key={i} className="barra-contenedor">
            <div className="barra" style={{ height: `${v}%` }} />
            <span>{dias[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
