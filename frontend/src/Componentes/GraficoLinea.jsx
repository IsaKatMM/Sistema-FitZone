import "./Graficos.css";

export default function GraficoLinea({ rango }) {
  const pesos = {
    "7D": [72, 71.8, 71.5, 71.2, 71, 70.8, 70.6],
    "1M": [73, 72.5, 72, 71.5, 71, 70.5, 70],
    "6M": [75, 74, 73, 72, 71, 70.5, 70],
    "ALL": [78, 76, 74, 72, 71, 70.5, 70],
  };

  const data = pesos[rango] ?? [];

  if (data.length === 0) {
    return <div className="grafico-card">Sin datos</div>;
  }

  const ultimoPeso = data[data.length - 1];

  const puntos = data
    .map((v, i) => `${i * 15},${40 - (v - 70) * 5}`)
    .join(" ");

  return (
    <div className="grafico-card">
      <h3>Tendencia de peso ({rango})</h3>
      <p className="valor">{ultimoPeso} kg</p>

      <svg viewBox="0 0 100 40" className="grafico-linea">
        <polyline
          fill="none"
          stroke="#ff7a00"
          strokeWidth="2"
          points={puntos}
        />
      </svg>
    </div>
  );
}
